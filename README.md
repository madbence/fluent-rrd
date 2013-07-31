fluent-rrd
==========

Fluent API for rrdtools in node.js

Graph
-----

### Time range ###

### Labels ###

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
