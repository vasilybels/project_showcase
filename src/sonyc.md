---
title: "What Sound Sensors Say About New York City’s Noise Pollution."
toc: true
---

```js
import { buildSonicChartData, filterUniversalTruthRows } from "./sonycData.js";
import { renderBubbleChart } from "./components/chart1.js";
import SONYC_CATEGORIES from "./components/tools/categories.js";
import countPresences from "./components/tools/extract.js";
import renderChart from "./components/chart15.js";
import countByHour from "./components/tools/countByHour.js";
import renderStrip from "./components/stripChart.js";

const rows = await FileAttachment("./data/data.csv").csv();
```


# What Sound Sensors Say About New York City’s Noise Pollution

From late 2016 to early 2020, a team of researchers and volunteers at [Sounds of New York City (SONYC)](https://wp.nyu.edu/sonyc/) used smart sound sensors to collect 30-second clips from across the Big Apple.

The team used these clips to assess noise levels in New York City's outdoor environments, marking the *presence* of several major noise sources in each clip, including machinery impact, non-machinery impact, construction equipment, voices, dogs, engines, and car alarms. With most sensors around the NYU area in downtown Manhattan and some in the outer boroughs, the data reflect outdoor sounds New Yorkers are most likely to hear in their daily lives.

## Motivation

In 2026 alone, the city has received over [145000](https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2020-to-Present/erm2-nwe9/about_data) 311 complaints about noise on the sidewalk or street. The SONYC project can help understand when certain sounds can be encountered.

By exploring this dataset, one can understand, among many other things,
* whether construction crews obey the legal timeframes in which they are allowed to work and produce noise,
* the amounts of vehicles and people on New York streets at different times of day,
* patterns of construction, driving, and going out across seasons, thanks to data spanning four years

## Data composition

Researchers and volunteers tagged the presence of 23 sounds, chosen in consultation with the New York City Department of Environmental Protection (DEP). These 23 fine-grained sound categories were then grouped into eight coarse-grained classes.

The chart below shows how many times each coarse-grained category of sounds has been recorded (in other words, it counts the "presences" of each sound across the database of all available 30-second clip).

```js
const dataCounted = countPresences(rows, SONYC_CATEGORIES);
display(renderChart({data: dataCounted}));
```

Over the course of four years, the sensors mostly picked up the sounds of car engines, alerts, and human voices. Car horns comprised over half of all alert signals, and vehicles with large engines made half of all engine noises. In addition, non-machinery impacts—loud bursts, kocks or slaps that are hard to place under a single category—were identified in nearly 20% of sound clips.

## Temporal distribution

```js
const soundOptions = new Map(SONYC_CATEGORIES.map(c => [c.name, c.key]));
const soundInput = Inputs.radio(soundOptions, {value: SONYC_CATEGORIES[0].key});
const sound = view(soundInput);
```
```js
display(renderStrip({data: countByHour(rows, sound)}));
```

## References
Read more about the motivation and creation of this dataset see the [DCASE 2020 Urban Sound Tagging with Spatiotemporal Context Task website](http://dcase.community/challenge2020/task-urban-sound-tagging-with-spatiotemporal-context).

<div>
	<a href="/" class="back-link">Back to all projects</a>
</div>

<!-- ```js
const topCategoryTotals = sonycCharts.radialPresence.sortedCategories
	.map((key) => ({
		key,
		category: sonycCharts.radialPresence.labelsByCategory[key] ?? key,
		total: sonycCharts.radialPresence.processedData.reduce((acc, row) => acc + (row[key] ?? 0), 0)
	}))
	.slice(0, 5);

display({
	totalRows: rows.length,
	universalTruthRows: sonycCharts.universalRows.length,
	topCategoryTotals
});

``` -->