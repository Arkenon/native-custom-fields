<?php
/**
 * User meta fields model for user profiles
 *
 * @package NativeCustomFields
 * @subpackage Models/UserMeta
 * @since 1.0.0
 */

namespace NativeCustomFields\Models\UserMeta;

use NativeCustomFields\Models\Common\FieldsConfigModel;

/**
 * User meta fields model for user profiles.
 */
class UserMetaFieldsConfigModel extends FieldsConfigModel
{
	/**
	 * User role the fields apply to. Meta box will be shown for all user roles by default.
	 *
	 * @var string
	 */
	public string $user_role = 'all_users';

	/**
	 * Saved field values.
	 *
	 * @var array
	 */
	public array $values = [];
}
