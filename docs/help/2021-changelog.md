# 2021

## v3.0.25 - [February 2, 2021](https://github.com/lando/lando/releases/tag/v3.0.25)

Lando is **free** and **open source** software that relies on contributions from developers like you! If you like Lando then help us spend more time making, updating and supporting it by [contributing](https://github.com/sponsors/lando).

* Added support for `lagoon.type == none` [#2828](https://github.com/lando/lando/issues/2828)
* Added `6.0` to list of supported `redis` versions
* Added "dumb" support for the `drupal9` `pantheon` framework [#2831](https://github.com/lando/lando/issues/2831)
* Fixed bug causing build hook installed `composer` version to not load correctly in `platformsh` recipe [#2826](https://github.com/lando/lando/issues/2826)
* Fixed bug causing `nvm` installed `node` versions to not load correctly in `platformsh` recipe when invoked via tooling [#2820](https://github.com/lando/lando/issues/2820)
* Fixed bug causing `composer` install to fail on `php` `8.0` [#2729](https://github.com/lando/lando/issues/2729)
* Fixed bug causing `port` to not be passed in correctly when authing against custom `lagoon` instance
* Improved `lando pull` for `lagoon` recipes to handle other files directory locations [#2762](https://github.com/lando/lando/issues/2762)
* Improved error message when `lando` cannot detect any `platformsh` applications for `platformsh` recipes [#2822](https://github.com/lando/lando/issues/2822)
* Improved error message when `lando` cannot detect a `lagoon.yml` for `lagoon` recipes [#2818](https://github.com/lando/lando/issues/2818)
* Updated `pantheon` recipe to use `wkhtmltopdf` version `0.12.5` in _most_ `php` images
* Updated `pantheon` recipe to use `terminus` version `2.5.0`
* Updated to Docker Desktop `3.1.0` and provided wider future patch support because https://github.com/docker/roadmap/issues/183