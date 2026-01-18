/**
 * Patterns Registry
 * Composed solutions and best practices
 */
import type { ComponentRegistry } from '../types';

// Docs
import { default as BulkActionBarDoc } from '../../content/patterns/data/BulkActionBar/docs/BulkActionBarDoc';
import { default as ExportDataDoc } from '../../content/patterns/data/ExportData/docs/ExportDataDoc';
import { default as FilterableDataTableDoc } from '../../content/patterns/data/FilterableDataTable/docs/FilterableDataTableDoc';
import { default as FormDoc } from '../../content/patterns/form/Form/docs/FormDoc';
import { default as SearchFilterDoc } from '../../content/patterns/search/SearchFilter/docs/SearchFilterDoc';
import { default as WizardDoc } from '../../content/patterns/process/Wizard/docs/WizardDoc';
import { default as AvatarUploadDoc } from '../../content/patterns/process/AvatarUpload/docs/AvatarUploadDoc';
import { default as CarouselDoc } from '../../content/patterns/display/Carousel/docs/CarouselDoc';
import { default as DataTransferButtonDoc } from '../../content/patterns/data/DataTransferButton/docs/DataTransferButtonDoc';
import { default as CardsDoc } from '../../content/patterns/display/Cards/docs/CardsDoc';
import { default as ImportModalDoc } from '../../content/patterns/data/ImportModal/docs/ImportModalDoc';
import { default as SectionLayoutDoc } from '../../content/patterns/layout/SectionLayout/docs/SectionLayoutDoc';
import { default as PageLayoutDoc } from '../../content/patterns/layout/PageLayout/docs/PageLayoutDoc';
import { default as HeaderLayoutDoc } from '../../content/patterns/layout/HeaderLayout/docs/HeaderLayoutDoc';
import { default as SidebarLayoutDoc } from '../../content/patterns/layout/SidebarLayout/docs/SidebarLayoutDoc';
import { default as ContentLayoutDoc } from '../../content/patterns/layout/ContentLayout/docs/ContentLayoutDoc';

// Demos
import * as BulkActionBarDemos from '../../content/patterns/data/BulkActionBar/demos';
import * as ExportDataDemos from '../../content/patterns/data/ExportData/demos';
import * as FilterableDataTableDemos from '../../content/patterns/data/FilterableDataTable/demos';
import * as SearchFilterDemos from '../../content/patterns/search/SearchFilter/demos';
import * as FormDemos from '../../content/patterns/form/Form/demos';
import * as WizardDemos from '../../content/patterns/process/Wizard/demos';
import * as AvatarUploadDemos from '../../content/patterns/process/AvatarUpload/demos';
import * as CarouselDemos from '../../content/patterns/display/Carousel/demos';
import * as DataTransferButtonDemos from '../../content/patterns/data/DataTransferButton/demos';
import * as CardsDemos from '../../content/patterns/display/Cards/demos';
import * as ImportModalDemos from '../../content/patterns/data/ImportModal/demos';
import * as SectionLayoutDemos from '../../content/patterns/layout/SectionLayout/demos';
import * as PageLayoutDemos from '../../content/patterns/layout/PageLayout/demos';
import * as HeaderLayoutDemos from '../../content/patterns/layout/HeaderLayout/demos';
import * as SidebarLayoutDemos from '../../content/patterns/layout/SidebarLayout/demos';
import * as ContentLayoutDemos from '../../content/patterns/layout/ContentLayout/demos';

export const patternsRegistry: ComponentRegistry = {
    'patterns/data/bulk-action-bar': {
        doc: BulkActionBarDoc,
        demos: BulkActionBarDemos,
        title: 'BulkActionBar',
    },
    'patterns/data/export-data': {
        doc: ExportDataDoc,
        demos: ExportDataDemos,
        title: 'ExportData',
    },
    'patterns/data/filterable-data-table': {
        doc: FilterableDataTableDoc,
        demos: FilterableDataTableDemos,
        title: 'FilterableDataTable',
    },
    'patterns/data/import-modal': {
        doc: ImportModalDoc,
        demos: ImportModalDemos,
        title: 'Import Modal',
    },
    'patterns/data/data-transfer-button': {
        doc: DataTransferButtonDoc,
        demos: DataTransferButtonDemos,
        title: 'Data Transfer Button',
    },
    'patterns/form/generic-form': {
        doc: FormDoc,
        demos: FormDemos,
        title: 'Forms',
    },
    'patterns/search/search-filter': {
        doc: SearchFilterDoc,
        demos: SearchFilterDemos,
        title: 'SearchFilter',
    },
    'patterns/display/metric-cards': {
        doc: CardsDoc,
        demos: CardsDemos,
        title: 'Metric Cards',
    },
    'patterns/display/carousel': {
        doc: CarouselDoc,
        demos: CarouselDemos,
        title: 'Carousel',
    },
    'patterns/process/wizard': {
        doc: WizardDoc,
        demos: WizardDemos,
        title: 'Wizard',
    },
    'patterns/process/avatar-upload': {
        doc: AvatarUploadDoc,
        demos: AvatarUploadDemos,
        title: 'Avatar Upload',
    },
    'patterns/layout/section-layout': {
        doc: SectionLayoutDoc,
        demos: SectionLayoutDemos,
        title: 'SectionLayout',
    },
    'patterns/layout/page-layout': {
        doc: PageLayoutDoc,
        demos: PageLayoutDemos,
        title: 'PageLayout',
    },
    'patterns/layout/header-layout': {
        doc: HeaderLayoutDoc,
        demos: HeaderLayoutDemos,
        title: 'HeaderLayout',
    },
    'patterns/layout/sidebar-layout': {
        doc: SidebarLayoutDoc,
        demos: SidebarLayoutDemos,
        title: 'SidebarLayout',
    },
    'patterns/layout/content-layout': {
        doc: ContentLayoutDoc,
        demos: ContentLayoutDemos,
        title: 'ContentLayout',
    },
};
