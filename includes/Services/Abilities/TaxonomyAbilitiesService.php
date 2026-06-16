<?php

/**
 * Taxonomy Abilities Service
 * Registers WP Abilities API abilities for creating, updating, and deleting custom taxonomies.
 *
 * @package NativeCustomFields
 * @subpackage Services\Abilities
 * @since 1.0.1
 */

namespace NativeCustomFields\Services\Abilities;

use Exception;
use NativeCustomFields\Services\OptionService;
use NativeCustomFields\Services\TermMetaService;

defined('ABSPATH') || exit;

class TaxonomyAbilitiesService
{
    private TermMetaService $termMetaService;
    private OptionService $optionService;

    public function __construct(TermMetaService $termMetaService, OptionService $optionService)
    {
        $this->termMetaService = $termMetaService;
        $this->optionService   = $optionService;
    }

    /**
     * Register Abilities
     *
     * @return void
     * @since 1.0.1
     */
    public function registerAbilities(): void
    {
        $taxonomy_schema = [
            'type'       => 'object',
            'required'   => ['taxonomy', 'label', 'object_type'],
            'properties' => [
                'taxonomy'         => ['type' => 'string', 'description' => __('Taxonomy slug (lowercase, max 32 chars)', 'native-custom-fields')],
                'label'            => ['type' => 'string', 'description' => __('Plural label', 'native-custom-fields')],
                'singular_name'    => ['type' => 'string', 'description' => __('Singular label (defaults to label if not set)', 'native-custom-fields')],
                'object_type'      => ['type' => 'array', 'items' => ['type' => 'string'], 'description' => __('Post types to attach this taxonomy to, e.g. ["post","page"]', 'native-custom-fields')],
                'description'      => ['type' => 'string'],
                'public'           => ['type' => 'boolean', 'default' => true],
                'hierarchical'     => ['type' => 'boolean', 'default' => true],
                'show_admin_column' => ['type' => 'boolean', 'default' => false, 'description' => __('Whether to display a column for the taxonomy on its post type listing screens', 'native-custom-fields')],
                'show_in_rest'     => ['type' => 'boolean', 'default' => true],
            ],
        ];

        $response_schema = [
            'type'       => 'object',
            'properties' => [
                'status'  => ['type' => 'boolean'],
                'message' => ['type' => 'string'],
            ],
        ];

        $permission = fn() => current_user_can('manage_options');

        wp_register_ability('native-custom-fields/create-taxonomy', [
            'label'               => __('Create Taxonomy', 'native-custom-fields'),
            'description'         => __('Creates a new custom taxonomy and saves its configuration.', 'native-custom-fields'),
            'category'            => 'native-custom-fields',
            'execute_callback'    => [$this, 'saveTaxonomy'],
            'input_schema'        => $taxonomy_schema,
            'output_schema'       => $response_schema,
            'permission_callback' => $permission,
            'meta'                => ['show_in_rest' => true, 'mcp' => ['public' => true]],
        ]);

        wp_register_ability('native-custom-fields/update-taxonomy', [
            'label'               => __('Update Taxonomy', 'native-custom-fields'),
            'description'         => __('Updates the configuration of an existing custom taxonomy.', 'native-custom-fields'),
            'category'            => 'native-custom-fields',
            'execute_callback'    => [$this, 'saveTaxonomy'],
            'input_schema'        => $taxonomy_schema,
            'output_schema'       => $response_schema,
            'permission_callback' => $permission,
            'meta'                => ['show_in_rest' => true, 'mcp' => ['public' => true]],
        ]);
    }

    /**
     * Save Taxonomy Ability
     *
     * @param array $input Input data
     * @return array Response data
     * @since 1.0.1
     */
    public function saveTaxonomy(array $input): array
    {
        try {
            $taxonomy = sanitize_key($input['taxonomy'] ?? '');

            if (empty($taxonomy)) {
                return ['status' => false, 'message' => __('taxonomy is required.', 'native-custom-fields')];
            }

            $label = sanitize_text_field($input['label'] ?? '');

            if (empty($label)) {
                return ['status' => false, 'message' => __('label is required.', 'native-custom-fields')];
            }

            $object_type = $input['object_type'] ?? [];
            if (empty($object_type)) {
                return ['status' => false, 'message' => __('object_type is required.', 'native-custom-fields')];
            }

            $menu_slug = 'native_custom_fields_taxonomy_builder_' . $taxonomy;

            $values = [
                'native_custom_fields_create_taxonomy_general' => [
                    'taxonomy'               => $taxonomy,
                    'label'                  => $label,
                    'singular_name'          => sanitize_text_field($input['singular_name'] ?? $label),
                    'description'            => sanitize_text_field($input['description'] ?? ''),
                    'object_type'            => array_map('sanitize_key', (array) $object_type),
                    'query_var'              => true,
                    'query_var_custom_slug'  => $taxonomy,
                    'default_term'           => false,
                    'default_term_settings'  => [
                        'default_term_name'        => '',
                        'default_term_slug'        => '',
                        'default_term_description' => '',
                    ],
                ],
                'native_custom_fields_create_taxonomy_labels'       => [],
                'native_custom_fields_create_taxonomy_visibility'   => [
                    'public'              => $input['public'] ?? true,
                    'hierarchical'        => $input['hierarchical'] ?? true,
                    'publicly_queryable'  => true,
                    'show_ui'             => true,
                    'show_in_menu'        => true,
                    'show_tagcloud'       => true,
                    'show_in_quick_edit'  => true,
                    'show_in_nav_menus'   => true,
                    'show_admin_column'   => $input['show_admin_column'] ?? false,
                ],
                'native_custom_fields_create_taxonomy_capabilities' => [
                    'capabilities' => [],
                    'sort'         => false,
                ],
                'native_custom_fields_create_taxonomy_rest_api' => [
                    'show_in_rest'            => $input['show_in_rest'] ?? true,
                    'rest_base'               => '',
                    'rest_controller_class'   => 'WP_REST_Terms_Controller',
                    'rest_namespace'          => 'wp/v2',
                ],
                'native_custom_fields_create_taxonomy_permalinks' => [
                    'rewrite'          => true,
                    'rewrite_settings' => [
                        'slug'         => $taxonomy,
                        'with_front'   => true,
                        'hierarchical' => $input['hierarchical'] ?? true,
                        'ep_mask'      => 'EP_NONE',
                    ],
                ],
            ];

            $response = $this->termMetaService->saveCustomTaxonomyConfig($menu_slug, $values);

            if ($response->status) {
                $this->optionService->saveOptions($menu_slug, $values);
            }

            return ['status' => $response->status, 'message' => $response->message];
        } catch (Exception $e) {
            return ['status' => false, 'message' => $e->getMessage()];
        }
    }

}
