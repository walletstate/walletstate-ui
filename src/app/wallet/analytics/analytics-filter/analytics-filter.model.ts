import {
  AnalyticsAggregateRequest,
  AnalyticsFilter,
  AnalyticsGroupBy,
  AnalyticsGroupRequest,
  AssetType,
  RecordType,
} from '@walletstate/angular-client';

export type BasicFilterData = {
  assets: string[];
  spentOn: string[];
  categories: string[];
  accounts: string[];
  generatedBy: string[];
};

export class AppAnalyticsFilter implements AnalyticsFilter {
  start: string = null;
  end: string = null;
  recordTypes: RecordType[] = [];
  recordTag: string = null;
  accountGroups: string[] = [];
  accounts: string[] = [];
  accountTag: string = null;
  categoryGroups: string[] = [];
  categories: string[] = [];
  categoryTag: string = null;
  assetTypes: AssetType[] = [];
  assetGroups: string[] = [];
  assets: string[] = [];
  assetTag: string = null;
  generatedBy: string[] = [];
  spentOn: string[] = [];

  constructor() {}

  static empty(): AppAnalyticsFilter {
    return new AppAnalyticsFilter();
  }

  static base(data: BasicFilterData): AppAnalyticsFilter {
    const filter = new AppAnalyticsFilter();
    filter.accounts = data.accounts ?? [];
    filter.categories = data.categories ?? [];
    filter.assets = data.assets ?? [];
    filter.generatedBy = data.generatedBy ?? [];
    filter.spentOn = data.spentOn ?? [];
    return filter;
  }

  withRecordType(recordType: RecordType) {
    const newFilter = this.clone();
    newFilter.recordTypes = [recordType];
    return newFilter;
  }

  withRecordTypes(recordTypes: RecordType[]) {
    const newFilter = this.clone();
    newFilter.recordTypes = recordTypes;
    return newFilter;
  }

  withCategoryGroup(categoryGroupId: string) {
    const newFilter = this.clone();
    newFilter.categoryGroups = [categoryGroupId];
    return newFilter;
  }

  withPeriod(start: Date, end: Date): AppAnalyticsFilter {
    const newFilter = this.clone();
    newFilter.start = start.toISOString();
    newFilter.end = end.toISOString();
    return newFilter;
  }

  groupBy(by: AnalyticsGroupBy, byFinalAsset: boolean): AnalyticsGroupRequest {
    return {
      filter: this,
      groupBy: by,
      byFinalAsset: byFinalAsset,
    };
  }

  aggregate(byFinalAsset: boolean): AnalyticsAggregateRequest {
    return {
      filter: this,
      byFinalAsset: byFinalAsset,
    };
  }

  private clone(): AppAnalyticsFilter {
    const newFilter = new AppAnalyticsFilter();
    newFilter.start = this.start;
    newFilter.end = this.end;
    newFilter.recordTypes = [...this.recordTypes];
    newFilter.recordTag = this.recordTag;
    newFilter.accountGroups = [...this.accountGroups];
    newFilter.accounts = [...this.accounts];
    newFilter.accountTag = this.accountTag;
    newFilter.categoryGroups = [...this.categoryGroups];
    newFilter.categories = [...this.categories];
    newFilter.categoryTag = this.categoryTag;
    newFilter.assetTypes = [...this.assetTypes];
    newFilter.assets = [...this.assets];
    newFilter.assetTag = this.assetTag;
    newFilter.generatedBy = [...this.generatedBy];
    newFilter.spentOn = [...this.spentOn];
    return newFilter;
  }
}
