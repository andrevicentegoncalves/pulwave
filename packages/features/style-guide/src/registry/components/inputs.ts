/**
 * Inputs Registry
 * Components for user input and data entry
 */
import type { ComponentRegistry } from '../types';
import * as InputsContent from '../../content/components/inputs';

export const inputsRegistry: ComponentRegistry = {
    'components/inputs/checkbox': {
        doc: InputsContent.CheckboxDoc,
        demos: InputsContent.CheckboxDemos,
        title: 'Checkbox',
    },
    'components/inputs/checkbox-group': {
        doc: InputsContent.CheckboxGroupDoc,
        demos: InputsContent.CheckboxGroupDemos,
        title: 'CheckboxGroup',
    },
    'components/inputs/color-picker': {
        doc: InputsContent.ColorPickerDoc,
        demos: InputsContent.ColorPickerDemos,
        title: 'ColorPicker',
    },
    'components/inputs/combobox': {
        doc: InputsContent.ComboboxDoc,
        demos: InputsContent.ComboboxDemos,
        title: 'Combobox',
    },
    'components/inputs/date-picker': {
        doc: InputsContent.DatePickerDoc,
        demos: InputsContent.DatePickerDemos,
        title: 'DatePicker',
    },
    'components/inputs/file-upload': {
        doc: InputsContent.FileUploadDoc,
        demos: InputsContent.FileUploadDemos,
        title: 'FileUpload',
    },
    'components/inputs/input': {
        doc: InputsContent.InputDoc,
        demos: InputsContent.InputDemos,
        title: 'Input',
    },
    'components/inputs/label': {
        doc: InputsContent.LabelDoc,
        demos: InputsContent.LabelDemos,
        title: 'Label',
    },
    'components/inputs/radio': {
        doc: InputsContent.RadioDoc,
        demos: InputsContent.RadioDemos,
        title: 'Radio',
    },
    'components/inputs/search-input': {
        doc: InputsContent.SearchInputDoc,
        demos: InputsContent.SearchInputDemos,
        title: 'SearchInput',
    },
    'components/inputs/select': {
        doc: InputsContent.SelectDoc,
        demos: InputsContent.SelectDemos,
        title: 'Select',
    },
    'components/inputs/slider': {
        doc: InputsContent.SliderDoc,
        demos: InputsContent.SliderDemos,
        title: 'Slider',
    },
    'components/inputs/switch': {
        doc: InputsContent.SwitchDoc,
        demos: InputsContent.SwitchDemos,
        title: 'Switch',
    },
    'components/inputs/textarea': {
        doc: InputsContent.TextAreaDoc,
        demos: InputsContent.TextAreaDemos,
        title: 'TextArea',
    },
    'components/inputs/time-picker': {
        doc: InputsContent.TimePickerDoc,
        demos: InputsContent.TimePickerDemos,
        title: 'TimePicker',
    },
    'components/inputs/transfer-list': {
        doc: InputsContent.TransferListDoc,
        demos: InputsContent.TransferListDemos,
        title: 'TransferList',
    },
    'components/inputs/rich-text-editor': {
        doc: InputsContent.RichTextEditorDoc,
        demos: InputsContent.RichTextEditorDemos,
        title: 'Rich Text Editor',
    },
    'components/inputs/inline-edit': {
        doc: InputsContent.InlineEditDoc,
        demos: InputsContent.InlineEditDemos,
        title: 'InlineEdit',
    },
    'components/inputs/sidebar-toggle': {
        doc: InputsContent.SidebarToggleDoc,
        demos: InputsContent.SidebarToggleDemos,
        title: 'SidebarToggle',
    },
    'components/inputs/theme-toggle': {
        doc: InputsContent.ThemeToggleDoc,
        demos: InputsContent.ThemeToggleDemos,
        title: 'ThemeToggle',
    },
};
