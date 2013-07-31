fluent-rrd
==========

Fluent API for rrdtools in node.js

Graph
-----

### Time range ###
#### `.from(time)` ####
Alias: `.start(time)`.

Set the start time to `time`. See `--start`, AT-STYLE TIME SPECIFICATION for details about the `time` parameter.

#### `.to(time)` ####
Alias: `.end(time)`.

Set the end time to `time`. See `--end`, AT-STYLE TIME SPECIFICATION for details about the `time` parameter.

#### `.step(time)` ####
Set resulution to `time` seconds if `time` is `Number`, otherwise it will be converted to seconds, like `'10m' = 600`. See `--step` for details, `parseTime` for accepted time formats.


### Labels ###
#### `.title(title)` ####
Set graph title to `title`. See `--title` for details.

#### `.vlabel(label)` ####
Set vertical label to `label`. See `--vertical-label` for details.


### Size ###
#### `.width(width)` ####
Set canvas width to `width` pixels. See `--width` for details.

#### `.height(height)` ####
Set canvas height to `height` pixels. See `--height` for details.

#### `.size(width, height)` ####
Set canvas size to `width`x`height` pixels. Shorthand function for `.width(width).height(height)`.

#### `.fullSize([width, height])` ####
Set the *image* size (instead of the canvas) to `width`x`height` pixels. Parameters are optional. See `--full-size-mode` for details.

#### `.thumbnail([width=256, height=32])` ####
Omit legend, labels, etc. Canvas size is set to `width`x`height` pixels, parameter defaults are `256`x`32`. See `--only-graph` for details.


### Limits ###
#### `.min(limit[, rigid])` ####
Aliases: `.lower(limit[, rigid])`, `.lowerLimit(limit[, rigid])`.

Set y-axis minimum value to `limit`, optionally disable autoscale with `rigid=true`. See `--lower-limit`, `--rigid` for details.

#### `.max(limit[, rigid])` ####
Aliases: `.upper(limit[, rigid])`, `.upperLimit(limit[, rigid])`.

Set y-axis maximum value to `limit`, optionally disable autoscale with `rigid=true`. See `--upper-limit`, `--rigid` for details.

#### `.altAutoscale([limit])` ####
Enable alternative autoscale. `limit` is optional, set to `'min'` or `'max'` to enable alt-autoscale only for lower or upper limits. See `--alt-autoscale` for details.

#### `.noGridFit()` ####
Disable grid fitting. See `--no-gridfit` for details.

### Misc ###
#### `.color(tag, color)` ####
Override the default color of `tag` to `color`. `tag` can be `'back'`, `'canvas'`, `'shadea'`, `'shadeb'`, `'grid'`, `'mgrid'`, `'font'`, `'axis'`, `'frame'`, `'arrow'`. `color` is a hexa color, with optional alpha component (range is in 00-FF), it must begin with a `#`. See `--color` for details.

#### `.dash(on, off)` ####
Alias: `.gridDash(on, off)`.

Set grid pattern. `.grid(1,0)` produces uninterrupted grid line, `.grid(1,3)` produces dotted grid. Default is `1,1`. See `--grid-dash` for details.

#### `.border(width[, shadea, shadeb])` ####
Set border width to `width` (default is 2), and optionally its color to `shadea` and `shadeb` (shorhand for `.border(width).color('shadea', shadea).color('shadeb', shadeb)`). See `--border` for details.

#### `.zoom(zoom)` ####
Set zoom factor to `zoom`. See `--zoom` for details.

#### `.font(tag, size[, font])` ####
Overrides the font for `tag`. Valid `tag` values: `'default'`, `'title'`, `'axis'`, `'unit'`, `'legend'`, `'watermark'`. See `--font` for details.

#### `.fontSize(size)` ####
Shorthand for `.font('default', size)`.

#### `.slope()` ####
More organic look. See `--slope-mode` for details.

#### `.interlaced()` ####
Produce interlaced images. See `--interlaced` for details.

#### `.tabWidth(width)` ####
Set tab width to `width` pixel. Default is `40`.

#### `.base(base)` ####
Set convert base to `base`. Eg 1KByte is 1024Byte, but 1 kbit is 1000 bit. See `--base` for details.

#### `.watermark(watermark)` ####
Display string `watermark` at the bottom. See `--watermark` for details.
