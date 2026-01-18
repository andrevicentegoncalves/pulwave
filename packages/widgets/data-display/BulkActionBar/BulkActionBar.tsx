import { createPortal } from 'react-dom';
import { classNames } from '@pulwave/utils';
import { Stack, Text, Button, X } from '@pulwave/ui';
import {
    bulkActionBarVariants,
    bulkActionBarContentVariants,
    bulkActionBarLayoutVariants,
    bulkActionBarSelectionInfoVariants,
    bulkActionBarCountVariants,
    bulkActionBarLabelVariants,
    bulkActionBarDividerVariants,
    bulkActionBarClearBtnVariants,
    bulkActionBarActionsVariants,
    type BulkActionBarProps
} from './types';
import './styles/_index.scss';

/**
 * BulkActionBar - Floating bar for multi-item actions
 */
export const BulkActionBar = ({
    open,
    selectedCount,
    totalCount,
    onClearSelection,
    actions,
    usePortal = true,
    className,
}: BulkActionBarProps) => {
    if (!open) return null;

    const content = (
        <div className={classNames(bulkActionBarVariants(), className)}>
            <div className={classNames(bulkActionBarContentVariants())}>
                <Stack direction="row" align="center" justify="between" className={classNames(bulkActionBarLayoutVariants())}>

                    <Stack direction="row" align="center" spacing={4}>
                        <div className={classNames(bulkActionBarSelectionInfoVariants())}>
                            <span className={classNames(bulkActionBarCountVariants())}>{selectedCount}</span>
                            <Text variant="body-s" className={classNames(bulkActionBarLabelVariants())}>
                                selected
                            </Text>
                        </div>
                        <div className={classNames(bulkActionBarDividerVariants())} />
                        <Button
                            variant="ghost"
                            size="s"
                            onClick={onClearSelection}
                            className={classNames(bulkActionBarClearBtnVariants())}
                            leftIcon={<X size={14} />}
                        >
                            Clear selection
                        </Button>
                    </Stack>

                    <Stack direction="row" align="center" spacing={3} className={classNames(bulkActionBarActionsVariants())}>
                        {actions}
                    </Stack>

                </Stack>
            </div>
        </div>
    );

    if (usePortal && typeof document !== 'undefined') {
        return createPortal(content, document.body);
    }

    return content;
};

export default BulkActionBar;
