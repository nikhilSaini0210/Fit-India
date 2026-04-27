import { FlatList, StyleSheet, View } from 'react-native';
import React, { FC, useCallback } from 'react';
import { goBack, navigate, rs, useSafeInsets } from '../../utils';
import { useApiError, useQuery } from '../../hooks';
import { dietApi } from '../../services/api';
import { DietPlan } from '../../types';
import { DIET_ROUTES, ROOT_ROUTES } from '../../constants';
import { PlanCard } from './components';
import {
  CardSkeleton,
  EmptyState,
  ErrorState,
  Header,
  ListHeader,
  ScreenWrapper,
} from '../../components';

const DietHistoryScreen: FC = () => {
  const insets = useSafeInsets();
  const handleError = useApiError();

  const { data, loading, refreshing, error, refresh } = useQuery<{
    plans: DietPlan[];
    total: number;
  }>(() => dietApi.getHistory({ page: 1, limit: 20 }) as any, [], {
    onError: handleError,
  });

  const plans = data?.plans ?? [];

  const onGenerateDietPlan = useCallback(() => {
    navigate(ROOT_ROUTES.MAIN, {
      screen: 'Diet',
      params: {
        screen: DIET_ROUTES.GENERATE,
      },
    });
  }, []);

  const handleViewPlan = useCallback((plan: DietPlan) => {
    // Edge case: navigate to DietPlan which always loads active plan
    // For history items, navigate to DietPlan and let the screen handle it
    navigate(ROOT_ROUTES.MAIN, {
      screen: 'Diet',
      params: {
        screen: DIET_ROUTES.DIET_PLAN,
      },
    });
  }, []);

  const renderItem = ({ item }: { item: DietPlan }) => (
    <PlanCard plan={item} onView={() => handleViewPlan(item)} />
  );

  return (
    <ScreenWrapper>
      <Header
        title="Diet History"
        showBack
        onBack={goBack}
        rightIcon="plus-circle-outline"
        onRightPress={onGenerateDietPlan}
      />

      {error ? (
        <ErrorState
          iconName="alert-circle-outline"
          title="Failed to load history"
          onPress={refresh}
          btnLable="Try again"
        />
      ) : (
        <FlatList
          data={loading ? [] : plans}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          ListHeaderComponent={
            !loading && plans.length > 0 ? (
              <ListHeader header={`${data?.total ?? 0} plans generated`} />
            ) : null
          }
          ListEmptyComponent={
            loading ? (
              <View style={s.skeletonWrap}>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </View>
            ) : (
              <EmptyState
                iconName="food-apple-outline"
                title="No plans yet"
                subTitle="Generate your first personalised Indian diet plan to get started"
                onPress={onGenerateDietPlan}
                btnTitle="Generate a planTry again"
              />
            )
          }
          contentContainerStyle={[
            s.listContent,
            { paddingBottom: insets.bottom + rs.verticalScale(24) },
          ]}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={refresh}
        />
      )}
    </ScreenWrapper>
  );
};

export default DietHistoryScreen;

const s = StyleSheet.create({
  listContent: {
    paddingHorizontal: rs.scale(16),
    paddingTop: rs.verticalScale(8),
  },

  skeletonWrap: { paddingTop: rs.verticalScale(8), gap: rs.verticalScale(12) },
});
