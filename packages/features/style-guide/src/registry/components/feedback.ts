/**
 * Feedback Registry
 * Components for user feedback and status
 */
import type { ComponentRegistry } from '../types';
import * as FeedbackContent from '../../content/components/feedback';

export const feedbackRegistry: ComponentRegistry = {
    'components/feedback/alert': {
        doc: FeedbackContent.AlertDoc,
        demos: FeedbackContent.AlertDemos,
        title: 'Alert',
    },
    'components/feedback/toast': {
        doc: FeedbackContent.ToastDoc,
        demos: FeedbackContent.ToastDemos,
        title: 'Toast',
    },
    'components/feedback/spinner': {
        doc: FeedbackContent.SpinnerDoc,
        demos: FeedbackContent.SpinnerDemos,
        title: 'Spinner',
    },
    'components/feedback/skeleton': {
        doc: FeedbackContent.SkeletonDoc,
        demos: FeedbackContent.SkeletonDemos,
        title: 'Skeleton',
    },
    'components/feedback/page-loader': {
        doc: FeedbackContent.PageLoaderDoc,
        demos: FeedbackContent.PageLoaderDemos,
        title: 'PageLoader',
    },
    'components/feedback/empty-state': {
        doc: FeedbackContent.EmptyStateDoc,
        demos: FeedbackContent.EmptyStateDemos,
        title: 'Empty State',
    },
    // Note: Overlays physically located in feedback folder but mapped to overlays section
    'components/overlays/modal': {
        doc: FeedbackContent.ModalDoc,
        demos: FeedbackContent.ModalDemos,
        title: 'Modal',
    },
    'components/overlays/confirmation-modal': {
        doc: FeedbackContent.ConfirmationModalDoc,
        demos: FeedbackContent.ConfirmationModalDemos,
        title: 'ConfirmationModal',
    },
    'components/overlays/tooltip': {
        doc: FeedbackContent.TooltipDoc,
        demos: FeedbackContent.TooltipDemos,
        title: 'Tooltip',
    },
};
