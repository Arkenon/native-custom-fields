<?php

/**
 * Post Type Abilities Service
 * Registers WP Abilities API abilities for creating, updating, and deleting custom post types.
 *
 * @package NativeCustomFields
 * @subpackage Services\Abilities
 * @since 1.0.1
 */

namespace NativeCustomFields\Services\Abilities;

use Exception;
use NativeCustomFields\Services\OptionService;
use NativeCustomFields\Services\PostMetaService;

defined('ABSPATH') || exit;

class PostTypeAbilitiesService
{
    private PostMetaService $postMetaService;
    private OptionService $optionService;
    public function __construct(PostMetaService $postMetaService, OptionService $optionService)
    {
        $this->postMetaService = $postMetaService;
        $this->optionService   = $optionService;
    }

    /**
     * Register Category
     *
     * @return void
     * @since 1.0.1
     */
    public function registerCategory(): void
    {
        wp_register_ability_category(
            'native-custom-fields',
            array(
                'label'       => __('NCF', 'native-custom-fields'),
                'description' => __('Abilities for Native Custom Fields.', 'native-custom-fields'),
            )
        );
    }

    /**
     * Register Abilities
     *
     * @return void
     * @since 1.0.1
     */
    public function registerAbilities(): void
    {
        $post_type_schema = [
            'type'       => 'object',
            'required'   => ['post_type', 'label'],
            'properties' => [
                'post_type'     => ['type' => 'string', 'description' => __('Post type slug (lowercase, max 20 chars, underscores allowed)', 'native-custom-fields')],
                'label'         => ['type' => 'string', 'description' => __('Plural label', 'native-custom-fields')],
                'singular_name' => ['type' => 'string', 'description' => __('Singular label (defaults to label if not set)', 'native-custom-fields')],
                'description'   => ['type' => 'string'],
                'menu_position' => ['type' => 'integer', 'description' => __('Menu position order (default: null, at the bottom)', 'native-custom-fields')],
                'menu_icon'     => ['type' => 'string', 'description' => __('Dashicons class or URL (e.g. dashicons-book)', 'native-custom-fields')],
                'has_archive'   => ['type' => 'boolean', 'default' => false],
                'supports'      => ['type' => 'array', 'items' => ['type' => 'string'], 'description' => __('Core features the post type supports (e.g. ["title","editor","thumbnail"])', 'native-custom-fields'), 'default' => ['title', 'editor', 'excerpt', 'comments', 'author', 'thumbnail', 'custom-fields']],
                'taxonomies'    => ['type' => 'array', 'items' => ['type' => 'string'], 'description' => __('Taxonomies to register for the post type (e.g. ["category","post_tag"])', 'native-custom-fields')],
                'public'        => ['type' => 'boolean', 'default' => true],
                'hierarchical'  => ['type' => 'boolean', 'default' => false],
                'show_in_rest'  => ['type' => 'boolean', 'default' => true],
                'map_meta_cap'  => ['type' => 'boolean', 'default' => true, 'description' => __('Whether to use the internal default meta capability handling', 'native-custom-fields')],
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

        wp_register_ability('native-custom-fields/create-post-type', [
            'label'               => __('Create Post Type', 'native-custom-fields'),
            'description'         => __('Creates a new custom post type and saves its configuration.', 'native-custom-fields'),
            'category'            => 'native-custom-fields',
            'execute_callback'    => [$this, 'savePostType'],
            'input_schema'        => $post_type_schema,
            'output_schema'       => $response_schema,
            'permission_callback' => $permission,
            'meta'                => ['show_in_rest' => true, 'mcp' => ['public' => true]],
        ]);

        wp_register_ability('native-custom-fields/update-post-type', [
            'label'               => __('Update Post Type', 'native-custom-fields'),
            'description'         => __('Updates the configuration of an existing custom post type.', 'native-custom-fields'),
            'category'            => 'native-custom-fields',
            'execute_callback'    => [$this, 'savePostType'],
            'input_schema'        => $post_type_schema,
            'output_schema'       => $response_schema,
            'permission_callback' => $permission,
            'meta'                => ['show_in_rest' => true, 'mcp' => ['public' => true]],
        ]);

    }

    /**
     * Save Post Type Ability
     *
     * @param array $input Input data
     * @return array Response data
     * @since 1.0.1
     */
    public function savePostType(array $input): array
    {
        try {
            $post_type = sanitize_key($input['post_type'] ?? '');

            if (empty($post_type)) {
                return ['status' => false, 'message' => __('post_type is required.', 'native-custom-fields')];
            }

            $label = sanitize_text_field($input['label'] ?? '');

            if (empty($label)) {
                return ['status' => false, 'message' => __('label is required.', 'native-custom-fields')];
            }

            $menu_slug = 'native_custom_fields_post_type_builder_' . $post_type;

            $values = [
                'native_custom_fields_create_post_type_general' => [
                    'post_type'               => $post_type,
                    'label'                   => $label,
                    'singular_name'           => sanitize_text_field($input['singular_name'] ?? $label),
                    'description'             => sanitize_text_field($input['description'] ?? ''),
                    'has_archive'             => $input['has_archive'] ?? false,
                    'has_archive_custom_slug' => null,
                    'query_var'               => true,
                    'query_var_custom_slug'   => '',
                    'menu_position'           => isset($input['menu_position']) ? (int) $input['menu_position'] : null,
                    'menu_icon'               => sanitize_text_field($input['menu_icon'] ?? ''),
                    'supports'                => is_array($input['supports'] ?? null) ? $input['supports'] : ['title', 'editor', 'excerpt', 'comments', 'author', 'thumbnail', 'custom-fields'],
                    'taxonomies'              => is_array($input['taxonomies'] ?? null) ? array_map('sanitize_key', $input['taxonomies']) : [],
                    'map_meta_cap'            => $input['map_meta_cap'] ?? true,
                ],
                'native_custom_fields_create_post_type_labels'    => [],
                'native_custom_fields_create_post_type_visibility' => [
                    'public'             => $input['public'] ?? true,
                    'hierarchical'       => $input['hierarchical'] ?? false,
                    'exclude_from_search' => false,
                    'publicly_queryable' => true,
                    'show_ui'            => true,
                    'show_in_menu'       => true,
                    'show_in_admin_bar'  => true,
                    'show_in_nav_menus'  => true,
                ],
                'native_custom_fields_create_post_type_capabilities' => [
                    'capability_type'  => 'post',
                    'can_export'       => true,
                    'delete_with_user' => false,
                ],
                'native_custom_fields_create_post_type_rest_api' => [
                    'show_in_rest'                    => $input['show_in_rest'] ?? true,
                    'rest_base'                       => '',
                    'rest_controller_class'           => 'WP_REST_Posts_Controller',
                    'rest_namespace'                  => 'wp/v2',
                    'autosave_rest_controller_class'  => 'WP_REST_Autosaves_Controller',
                    'revisions_rest_controller_class' => 'WP_REST_Revisions_Controller',
                ],
                'native_custom_fields_create_post_type_permalinks' => [
                    'rewrite'          => true,
                    'rewrite_settings' => [
                        'slug'       => $post_type,
                        'with_front' => true,
                        'feeds'      => false,
                        'pages'      => true,
                        'ep_mask'    => 'EP_PERMALINK',
                    ],
                ],
                'native_custom_fields_create_post_type_template' => [
                    'template'        => false,
                    'template_config' => ['template_blocks' => [], 'template_lock' => false],
                ],
            ];

            $response = $this->postMetaService->savePostTypeConfig($menu_slug, $values);

            if ($response->status) {
                $this->optionService->saveOptions($menu_slug, $values);
            }

            return ['status' => $response->status, 'message' => $response->message];
        } catch (Exception $e) {
            return ['status' => false, 'message' => $e->getMessage()];
        }
    }

}
