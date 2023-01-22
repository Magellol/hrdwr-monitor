// This import is unused but we need it for module augmentation to work.
import "csstype";

declare module "csstype" {
  /**
   * Augment the base `CSS.Properties` interface.
   * We do this to add custom CSS variables wherever `CSS.Properties` is accepted (i.e style attribute on DOM elements).
   *
   * @link https://github.com/frenic/csstype#what-should-i-do-when-i-get-type-errors
   */
  interface Properties {
    "--thermal-gauge-main-color"?: string;
    "--thermal-gauge-faded-color"?: string;
  }
}
