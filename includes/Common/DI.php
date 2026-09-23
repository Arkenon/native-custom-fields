<?php
/**
 * Dependency Injection Container Configurations
 *
 * @package NativeCustomFields
 * @subpackage Common
 * @since 1.0.0
 */

namespace NativeCustomFields\Common;

defined('ABSPATH') || exit;

use DI\Container;
use DI\ContainerBuilder;
use Exception;

/**
 * Dependency Injection Container Configurations.
 */
class DI
{
	/**
	 * Dependency Injection Container Instance
     *
	 * @var Container|null
	 * @since 1.0.0
	 */
	private static ?Container $container = null;

	/**
	 * Dependency Injection Container
     *
	 * @return Container
	 * @throws Exception If an unexpected error occurs.
	 * @since 1.0.0
	 */
	public static function container(): Container
	{
		if (null === self::$container) {
			$containerBuilder = new ContainerBuilder();
			$containerBuilder->useAutowiring(true);
			self::$container = $containerBuilder->build();
		}
		return self::$container;
	}
}
