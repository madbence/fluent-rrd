fluent-rrd
==========

Fluent API for rrdtools in node.js

Graph
-----

### Time range ###

### Labels ###

### Size ###

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
