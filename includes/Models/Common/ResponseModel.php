<?php
/**
 * Error model class
 * Contains default parameters for error response
 *
 * @package NativeCustomFields
 * @subpackage Models\Common
 * @since 1.0.0
 */

namespace NativeCustomFields\Models\Common;

defined('ABSPATH') || exit;

/**
 * Error model class.
 */
class ResponseModel
{
	public bool $status = true;
	public string $message = 'Success.';
}
