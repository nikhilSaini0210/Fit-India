# FitIndia RN — Complete Setup

## Install

```bash
npm install
cd ios && pod install && cd ..   # iOS only
```

> Firebase push notifications are optional.
> If you skip Firebase, the app still works — push just won't fire.
> Remove `@react-native-firebase/*` from package.json if not needed yet.

---

## Folder structure (48 files, zero duplicates)

```
src/
├── constants/
│   ├── config.ts          API_BASE_URL · ENDPOINTS · STORAGE_KEYS · CACHE_TTL · HTTP
│   ├── routes.ts          Every screen name as a typed const
│   └── index.ts
│
├── types/
│   ├── api.ts             All API shapes + domain models + AppError
│   ├── navigation.ts      All param lists · CompositeScreenProps · global augmentation
│   └── index.ts
│
├── store/
│   ├── mmkv.ts            MMKV singleton · typed helpers · TTL cache · offline queue
│   │                      · Zustand adapter · RawTokens (for interceptor)
│   ├── authStore.ts       Auth state (user, tokens, isLoggedIn) → MMKV
│   ├── dietStore.ts       Active plan + today's meals → MMKV
│   ├── workoutStore.ts    Active plan + today's workout → MMKV
│   ├── progressStore.ts   Summary + streak + latest log → MMKV
│   └── index.ts
│
├── services/
│   ├── api/
│   │   ├── client.ts      Axios · request interceptor · response interceptor
│   │   │                  21 edge cases: token attach, silent refresh, queue,
│   │   │                  offline detection, timeout, 401/403/422/429/5xx
│   │   ├── auth.api.ts
│   │   ├── user.api.ts
│   │   ├── diet.api.ts
│   │   ├── workout.api.ts
│   │   ├── progress.api.ts
│   │   ├── push.api.ts
│   │   └── index.ts
│   └── pushHandler.ts     FCM token register · deep-link routing · foreground/background
│
├── navigation/
│   ├── AppNavigator.tsx   Root: interceptor wiring · NetInfo · AppState · profile guard
│   │                      · push init · offline replay
│   ├── MainTabNavigator.tsx   5-tab bottom nav
│   ├── SplashScreen.tsx   Startup auth resolution → correct first screen
│   └── stacks/
│       ├── AuthStack.tsx      Splash·Onboarding·Login·Register·ProfileSetup·ForgotPassword
│       ├── HomeStack.tsx      Home·QuickWorkout·Streak·NutritionTargets
│       ├── DietStack.tsx      DietToday·DietPlan·DayDetail·MealDetail·Generate·History
│       ├── WorkoutStack.tsx   WorkoutToday·Plan·DayDetail·ActiveWorkout·Complete
│       ├── ProgressStack.tsx  Progress·LogWeight·Charts·StreakBadges
│       └── ProfileStack.tsx   Profile·EditProfile·Notifications·Subscription·Settings
│
├── hooks/
│   ├── useAuth.ts         login · register · logout (handles navigation automatically)
│   ├── useApiError.ts     AppError code → user-friendly Alert
│   ├── useProfile.ts      updateProfile · updateNotifications
│   ├── useQuery.ts        Generic data fetch: loading · refreshing · error · cache · refetch
│   ├── useMutation.ts     (inside useQuery.ts) POST/PATCH/DELETE with loading/error
│   ├── useDiet.ts         useTodaysMeals · useActiveDietPlan · useGenerateDietPlan
│   ├── useWorkout.ts      useTodaysWorkout · useActiveWorkoutPlan · useMarkWorkoutComplete
│   ├── useProgress.ts     useProgressSummary · useStreak · useProgressHistory · useLogProgress
│   └── index.ts
│
├── utils/
│   ├── navigationUtils.ts   Nav helper: resetToAuth · resetToMain · toDietToday etc.
│   └── networkUtils.ts      useIsOnline() hook · checkIsOnline() async
│
└── components/
    ├── ErrorBoundary.tsx  Class component, catches render crashes, shows Try again
    ├── OfflineBanner.tsx  Animated red banner, appears when offline
    └── index.ts
```

---

## Usage examples

### Fetch data in a screen

```tsx
import { useTodaysMeals } from '../hooks';

const DietTodayScreen = () => {
  const { data, loading, refreshing, error, refresh } = useTodaysMeals();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorView message={error} onRetry={refresh} />;

  return (
    <FlatList
      data={Object.values(data?.meals ?? {})}
      refreshing={refreshing}
      onRefresh={refresh}
      renderItem={({ item }) => <MealCard meal={item} />}
    />
  );
};
```

### Mutate data

```tsx
import { useLogProgress, useApiError } from '../hooks';

const LogWeightScreen = () => {
  const { mutate, loading } = useLogProgress();
  const handleError = useApiError();

  const submit = async () => {
    const result = await mutate({ weight: 72.5, mood: 'good' });
    if (!result.ok) handleError(result.error);
    else navigation.goBack();
  };
};
```

### Typed navigation between stacks

```tsx
import type { DietStackScreenProps } from '../types';

// Fully typed — params, parent tab, sibling screens
const DietDayDetail = ({
  navigation,
  route,
}: DietStackScreenProps<'DietDayDetail'>) => {
  const { dayIndex } = route.params; // ✅ typed

  // Navigate within Diet stack
  navigation.navigate('MealDetail', { mealType: 'breakfast', dayIndex });

  // Navigate to another tab (Workout)
  navigation.navigate('Workout', { screen: 'WorkoutToday' });
};
```

### Navigate from outside React (push notifications, services)

```tsx
import { Nav } from '../utils/navigationUtils';

// In Firebase onMessage handler (not a component)
messaging().onNotificationOpenedApp(msg => {
  switch (msg.data?.screen) {
    case 'DietToday':
      Nav.toDietToday();
      break;
    case 'WorkoutToday':
      Nav.toWorkoutToday();
      break;
    case 'LogWeight':
      Nav.toLogWeight();
      break;
  }
});
```

### API call with TTL cache

```tsx
import { apiClient } from '../services/api';
import { getCached, setCached } from '../store';
import { ENDPOINTS, STORAGE_KEYS, CACHE_TTL } from '../constants/config';

const fetchTargets = async () => {
  const hit = getCached(STORAGE_KEYS.CACHE_NUTRITION_TARGETS);
  if (hit) return hit;

  const res = await apiClient.get(ENDPOINTS.NUTRITION_TARGETS);
  const data = res.data.data.targets;
  setCached(
    STORAGE_KEYS.CACHE_NUTRITION_TARGETS,
    data,
    CACHE_TTL.NUTRITION_TARGETS,
  );
  return data;
};
```

---

## Edge cases handled (21 total)

| #   | Scenario                                        | File                                         |
| --- | ----------------------------------------------- | -------------------------------------------- |
| 1   | Token attached to every request                 | `client.ts` request interceptor              |
| 2   | Public routes (no token needed)                 | `client.ts` — header omitted                 |
| 3   | 401 → silent access token refresh               | `client.ts` response interceptor             |
| 4   | 3 concurrent 401s → only 1 refresh              | `client.ts` waitingQueue                     |
| 5   | All queued requests retry after refresh         | `client.ts` flushQueue                       |
| 6   | Refresh token missing → force logout            | `client.ts`                                  |
| 7   | Refresh endpoint itself returns 401             | `client.ts` URL guard                        |
| 8   | Refresh fails → all queued reject               | `client.ts` flushQueue                       |
| 9   | Network error (no internet)                     | `client.ts` + NetInfo in request interceptor |
| 10  | Request timeout (ECONNABORTED)                  | `client.ts`                                  |
| 11  | Write requests queued while offline             | `client.ts` + `mmkv.ts` OFFLINE_QUEUE        |
| 12  | Offline queue replayed on reconnect             | `AppNavigator` NetInfo listener              |
| 13  | 403 Forbidden                                   | `client.ts`                                  |
| 14  | 422 Validation with per-field errors            | `client.ts` + `useApiError`                  |
| 15  | 429 Rate limited                                | `client.ts`                                  |
| 16  | 5xx Server error                                | `client.ts`                                  |
| 17  | App opens, token valid → direct to Main         | `SplashScreen` + `AppNavigator`              |
| 18  | App opens, token expired → first call refreshes | interceptor                                  |
| 19  | Profile incomplete after register               | `SplashScreen` + `AppNavigator` guard        |
| 20  | Force logout from interceptor                   | `setInterceptorCallbacks` in `AppNavigator`  |
| 21  | Back gesture disabled on ActiveWorkout/Generate | stack `gestureEnabled: false`                |

---

## Firebase setup (push notifications)

1. Create project at [console.firebase.google.com](https://console.firebase.google.com)
2. Add Android app (package: `com.fitindia`) → download `google-services.json` → place in `android/app/`
3. Add iOS app (bundle ID: `com.fitindia`) → download `GoogleService-Info.plist` → add to Xcode project
4. Follow [@react-native-firebase setup](https://rnfirebase.io/) to add native config
5. `cd ios && pod install`

Push notifications will then work automatically — `pushHandler.ts` handles the rest.
