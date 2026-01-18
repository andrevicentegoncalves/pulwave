/**
 * Typography Registry
 * Components for text and typography
 */
import type { ComponentRegistry } from '../types';
import * as TypographyContent from '../../content/components/typography';

export const typographyRegistry: ComponentRegistry = {
    'foundation/typography/text': {
        doc: TypographyContent.TextDoc,
        demos: TypographyContent.TextDemos,
        title: 'Text',
    },
};
