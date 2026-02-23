<?php

/**
 * Helper class for common functions
 *
 * @package NativeCustomFields
 * @subpackage Common
 * @since 1.0.0
 */

namespace NativeCustomFields\Common;

use NativeCustomFields\Models\Common\FieldsConfigModel;

defined('ABSPATH') || exit;

class Helper
{

    /**
     * Sanitize input
     *
     * @param string $name Input name
     * @param string $method GET or POST or REQUEST
     * @param string $type Type of input (title, id, textarea, url, email, username, text, bool)
     *
     * @return bool|int|string|null
     * @since 1.0.0
     */
    public static function sanitize(string $name, string $method, string $type = "text")
    {

        $value = "";
        $method = strtolower($method);

        // phpcs:ignore WordPress.Security.NonceVerification.Recommended, WordPress.Security.NonceVerification.Missing -- This is a helper method for sanitization, not directly processing form data.
        $input = $method === 'post' ? $_POST : ($method === 'get' ? $_GET : $_REQUEST);

        if (isset($input[$name])) {
            $value = wp_unslash($input[$name]);
            $value = is_array($value) ? self::sanitizeArray($value) : sanitize_text_field($value);
        }

        if (isset($value)) {
            switch ($type) {
                case "title":
                    return sanitize_title($value);
                case "id":
                    return absint($value);
                case "textarea":
                    return sanitize_textarea_field($value);
                case "url":
                    return esc_url_raw($value);
                case "email":
                    return sanitize_email($value);
                case "username":
                    return sanitize_user($value);
                case "bool":
                    return rest_sanitize_boolean($value);
                case "key":
                    return sanitize_key($value);
                default:
                    return $value;
            }
        }

        return null;
    }

    /**
     * Sanitize array recursively
     *
     * @param array $array
     *
     * @return array
     * @since 1.0.0
     */
    public static function sanitizeArray(array $array): array
    {
        return array_map(function ($value) {
            if (is_array($value)) {
                return self::sanitizeArray($value);
            }

            return sanitize_text_field($value);
        }, array_combine(
            array_map('sanitize_text_field', array_keys($array)),
            $array
        ));
    }

    /**
     * Get allowed endpoint mask list for permalink structure
     *
     * @return array
     * @since 1.0.0
     */
    public static function getAllowedEpMaskList(): array
    {
        return [
            'EP_ALL',
            'EP_NONE',
            'EP_ALL_ARCHIVES',
            'EP_ATTACHMENT',
            'EP_AUTHORS',
            'EP_CATEGORIES',
            'EP_COMMENTS',
            'EP_DATE',
            'EP_DAY',
            'EP_MONTH',
            'EP_YEAR',
            'EP_PAGES',
            'EP_PERMALINK',
            'EP_ROOT',
            'EP_SEARCH',
            'EP_TAGS',
            'EP_TAGS'
        ];
    }

    /**
     * Check if a post is of a certain type and status on AJAX actions
     *
     * @param string $key
     *
     * @return void
     * @since 1.0.0
     */
    public static function ajaxGuard(string $key = ''): void
    {
        check_ajax_referer('nonce', $key);
    }

    /**
     * Upload files to the media library
     *
     * @return array|false
     * @since 1.0.0
     */
    public static function uploadFiles()
    {

        $file_to_upload = [];

        if (isset($_FILES['files'])) { // phpcs:ignore WordPress.Security.NonceVerification.Missing -- Nonce verified by the calling method.
            // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- Sanitized in the loop below.
            $files = $_FILES['files'];

            if (!function_exists('wp_handle_upload')) {
                require_once ABSPATH . 'wp-admin/includes/file.php';
            }

            foreach ($files['name'] as $key => $name) {

                $upload_overrides = ['test_form' => false];

                if (!empty($files['name'][$key])) {

                    $file = [
                        'name' => sanitize_file_name($files['name'][$key]),
                        'type' => sanitize_mime_type($files['type'][$key]),
                        'tmp_name' => sanitize_text_field($files['tmp_name'][$key]),
                        'error' => sanitize_text_field($files['error'][$key]),
                        'size' => (int)$files['size'][$key],
                    ];

                    $upload = wp_handle_upload($file, $upload_overrides);

                    $filename = $upload['file'];
                    $filetype = wp_check_filetype(basename($filename), null);
                    $wp_upload_dir = wp_upload_dir();
                    $post_title = preg_replace('/\.[^.]+$/', '', basename($filename));
                    $attachment = [
                        'guid' => $wp_upload_dir['url'] . '/' . basename($filename),
                        'post_mime_type' => $filetype['type'],
                        'post_title' => $post_title,
                        'post_content' => '',
                        'post_status' => 'inherit',
                    ];
                    $attach_id = wp_insert_attachment($attachment, $filename);

                    if (is_wp_error($attach_id)) {
                        return false;
                    }

                    $file_url = wp_get_attachment_url($attach_id);
                    $file_to_upload[] = [
                        'file_to_upload' => esc_url($file_url),
                        'file_name' => $post_title,
                    ];
                }
            }
        }

        return $file_to_upload;
    }

    /**
     * Get JSON data from uploaded file
     * Convert uploaded JSON file to array
     *
     * @param array $file Uploaded file array
     *
     * @return array
     * @since 1.0.0
     */
    public static function getJsonFromFileUpload(array $file): array
    {

        if (isset($file['tmp_name']) && is_uploaded_file($file['tmp_name'])) {
            $content = file_get_contents($file['tmp_name']);
            if (self::isJson($content)) {
                return json_decode($content, true);
            }
        }

        return [];
    }

    /**
     * Normalize meta type to allowed values.
     * Allowed types: string, boolean, integer, number, array, object
     * Used for register_post_meta, register_term_meta etc.
     *
     * @param string $type
     *
     * @return string
     * @since 1.0.0
     */
    public static function normalizeMetaType(string $type): string
    {
        $allowed_types = ['string', 'boolean', 'integer', 'number', 'array', 'object'];

        return in_array($type, $allowed_types, true) ? $type : 'string';
    }

    /**
     * Get sections and fields from configuration
     *
     * @param FieldsConfigModel $config Fields configuration
     *
     * @return array
     */
    public static function getSectionsAndFieldsFromConfig(FieldsConfigModel $config): array
    {
        if (!empty($config->sections)) {
            return $config->sections;
        }

        return [];
    }

    /**
     * Get sections from configuration
     * It can also be used for meta boxes.
     * @param array $config Fields configuration
     *
     * @return array
     */
    public static function getSectionsFromConfig(array $config): array
    {
        if (!empty($config['sections'])) {
            return $config['sections'];
        }

        return [];
    }

    /**
     * Check if the menu slug is a builder page
     * @param string $menu_slug
     * @return bool
     * @since 1.0.0
     */
    public static function isBuilderPage(string $menu_slug): bool
    {
        return in_array($menu_slug, Constants::BUILDER_MENU_SLUGS, true);
    }

    /**
     * Fields that are already have input tag
     * @return array
     * @since 1.0.0
     */
    public static function fieldsAlreadyHaveInput(): array
    {
        return ['text', 'textarea', 'number', 'input', 'range', 'combobox'];
    }

    /**
     * Check if a string is valid JSON
     *
     * @param string $string String to check
     *
     * @return boolean
     */
    public static function isJson(string $string): bool
    {

        json_decode($string);

        return json_last_error() === JSON_ERROR_NONE;
    }

    /**
     * Get allowed hidden input html
     *
     * @return array
     */
    public static function getAllowedHiddenInputHtml(): array
    {
        return [
            'input' => [
                'id' => [],
                'type' => [],
                'name' => [],
                'value' => [],
            ],
        ];
    }

    /**
     * Convert snake_case to camelCase
     *
     * @param array $data Data to convert
     *
     * @return array
     */
    public static function snakeToCamelArray(array $data): array
    {
        $result = [];
        foreach ($data as $key => $value) {
            $camelKey = lcfirst(str_replace(' ', '', ucwords(str_replace('_', ' ', $key))));
            if (is_array($value)) {
                $value = self::snakeToCamelArray($value);
            }
            $result[$camelKey] = $value;
        }

        return $result;
    }

    /**
     * Renders a builder page wrapper div
     *
     * @param string $wrapperClass The CSS class for the wrapper div
     *
     * @return void
     * @since 1.0.0
     */
    public static function renderBuilderPage(string $wrapperClass): void
    {
        $screen = get_current_screen();
        $id = str_replace('toplevel_page_', '', $screen->id);

        $html = sprintf('<div class="%s" id="%s"></div>',
            esc_attr($wrapperClass),
            esc_attr($id)
        );

        echo wp_kses_post($html);
    }


    /**
     * Handle field list to prepare field data
     *
     * @param array $fields
     *
     * @return array
     */
    public static function prepareFieldList(array $fields): array //TODO remove if needed
    {

        $field_list = [];

        foreach ($fields as $field) {
            // Get field data from option groups
            $field_base_info = $field['field_base_info'] ?? [];
            $field_label_info = $field['field_label_info'] ?? [];
            $field_type_info = $field['field_type_info'] ?? [];

            //Get custom field data by field type
            $field_custom_info = [];
            if (!empty($field_type_info) && !empty($field_type_info['fieldType'])) {
                $custom_key = 'field_custom_info_' . $field_type_info['fieldType'];
                if (isset($field[$custom_key])) {
                    $field_custom_info = $field[$custom_key];

                    // Recursive handling for group and repeater fields
                    if (($custom_key === 'field_custom_info_group' && !empty($field_custom_info['fields'])) || ($custom_key === 'field_custom_info_repeater' && !empty($field_custom_info['fields']))) {
                        $field_custom_info['fields'] = self::prepareFieldList($field_custom_info['fields']);

                        // For repeater fields with table layout, hide labels of inner fields
                        if ($field_type_info['fieldType'] === 'repeater' && isset($field_custom_info['layout']) && $field_custom_info['layout'] === 'table') {
                            foreach ($field_custom_info['fields'] as &$item) {
                                $item['hideLabel'] = true;
                            }
                            unset($item);
                        }
                    }
                }
            }

            // Condition to set default value for date and date time picker fields
            if (!empty($field_type_info) && (($field_type_info['fieldType'] ?? '') === 'date_picker' || ($field_type_info['fieldType'] ?? '') === 'date_time_picker')) {
                $field_type_info['default'] = $field_custom_info['currentDate'] ?? null;
            }

            //Merge and set field data
            $field_info = array_merge(
                $field_base_info,
                $field_label_info,
                $field_type_info,
                $field_custom_info,
                ['dependencies' => $field['field_dependency_info'] ?? []]
            );

            $field_list[] = $field_info;
        }

        return $field_list;
    }
}
