import {Button} from "@wordpress/components";
import {postList} from "@wordpress/icons";
import {__} from "@wordpress/i18n";

const AddOrEditFieldsButton = ({row, handleAddFields}) => {
    return (
        <Button
            variant="secondary"
            icon={postList}
            onClick={() => handleAddFields(row)}
        >
            {__('Fields', 'native-custom-fields')}
        </Button>
    )
}

export default AddOrEditFieldsButton;