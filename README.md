fluent-rrd
==========

Fluent API for rrdtools in node.js

Graph
-----

### Time range ###
#### `.from(time)` ####
Alias: `.start(time)`.

Sets the start time to `time`. See `--start`, AT-STYLE TIME SPECIFICATION for details about the `time` parameter.

#### `.to(time)` ####
Alias: `.end(time)`.

Sets the end time to `time`. See `--end`, AT-STYLE TIME SPECIFICATION for details about the `time` parameter.

#### `.step(time)` ####
Set resulution to `time` seconds if `time` is `Number`, otherwise it will be converted to seconds, like `'10m' = 600`. See `--step` for details, `parseTime` for accepted time formats.


### Labels ###
#### `.title(title)` ####
Sets graph title to `title`. See `--title` for details.

#### `.vlabel(label)` ####
Sets vertical label to `label`. See `--vertical-label` for details.


### Size ###
#### `.width(width)` ####
Set canvas width to `width` pixels. See `--width` for details.

#### `.height(height)` ####
Set canvas height to `height` pixels. See `--height` for details.

#### `.size(width, height)` ####
Set canvas size to `width`x`height` pixels. Shorthand function for `.width(width).height(height)`.

#### `.fullSize(width, height)` ####
Set the *image* size (instead of the canvas) to `width`x`height` pixels. Parameters are optional. See `--full-size-mode` for details.

#### `.thumbnail(width, height)` ####
Omit legend, labels, etc. Canvas size is set to `width`x`height` pixels, parameter defaults are `256`x`32`. See `--only-graph` for details.


### Limits ###
#### `.min(limit, rigid)` ####
Aliases: `.lower(limit, rigid)`, `.lowerLimit(limit, rigid)`.

Sets y-axis minimum value to `limit`, optionally disable autoscale with `rigid=true`. See `--lower-limit`, `--rigid` for details.

#### `.max(limit, rigid)` ####
Aliases: `.upper(limit, rigid)`, `.upperLimit(limit, rigid)`.

Sets y-axis maximum value to `limit`, optionally disable autoscale with `rigid=true`. See `--upper-limit`, `--rigid` for details.

#### `.altAutoscale(limit)` ####
Enable alternative autoscale. `limit` is optional, set to `min` or `max` to enable alt-autoscale only for lower or upper limits. See `--alt-autoscale` for details.

#### `.noGridFit()` ####
Disable grid fitting. See `--no-gridfit` for details.
