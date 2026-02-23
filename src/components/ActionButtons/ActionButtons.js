import {__} from '@wordpress/i18n';
import {Flex, Button} from '@wordpress/components';

const ActionButtons = (
    {
        onResetAll,
        onResetSection,
        onSave,
        isSaving,
        hasChanges,
        resetSection = false,
        resetForm = true
    }
) => {
    return (
        <Flex className="native-custom-fields-actions" justify="flex-end" gap={2}>
            {
                (onResetAll && resetForm) && (
                    <Button
                        variant="tertiary"
                        onClick={onResetAll}
                    >
                        {__('Reset All', 'native-custom-fields')}
                    </Button>
                )
            }
            {
                (onResetSection && resetSection) && (
                    <Button
                        variant="secondary"
                        onClick={onResetSection}
                    >
                        {__('Reset Section', 'native-custom-fields')}
                    </Button>
                )
            }
            <Button
                variant="primary"
                onClick={onSave}
                isBusy={isSaving}
                disabled={!hasChanges || isSaving}
            >
                {isSaving ? __('Saving...', 'native-custom-fields') : __('Save Changes', 'native-custom-fields')}
            </Button>
        </Flex>
    );
};

export default ActionButtons;
