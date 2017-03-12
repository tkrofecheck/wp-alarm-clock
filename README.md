## Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-contrib-uglify --save-dev
```

Run the below to install node modules for Alarm Clock

```shell
npm install
```

Once modules have installed, please run the following command in the root folder 'wp-alarm-clock':

```shell
grunt build
```

You may test compiled code, located here:
_wp-alarm-clock/build_

Your deployment code will reside here:
_wp-alarm-clock/dist_

You may test the compiled code in a browser


## Next Steps for improvement

1. I would like to enhance this by converting to an AMD module with config object passed in.
2. Implement support for custom options in config object
* allow different snooze times
* alarm message / animation
* theme (fonts, colors, images, sounds)
* allow different layout (horizontal, vertical, 4 corners)
* possible idea: include current location temperature