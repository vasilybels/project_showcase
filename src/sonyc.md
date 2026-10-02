---
toc: true
title: "What Sound Sensors Say About NYC's Noise"
---

```js
import { buildSonicChartData, SONYC_DAY_NAMES } from "./sonycData.js";
import {renderExplorer} from "./components/explorer.js";
const rows = await FileAttachment("data/data.csv").csv();
const sonycCharts = buildSonicChartData(rows);
```

# What Sound Sensors Say About New York City's Noise Pollution

New York City is loud, and the city knows it: in 2026 alone, New Yorkers have already filed over [145,000 311 complaints](https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2020-to-Present/erm2-nwe9/about_data) about noise on the sidewalk or street. From 2016 through 2019, a research effort called [**Sounds of New York City (SONYC)**](https://wp.nyu.edu/sonyc/) tried to measure that noise directly, rather than wait for someone to call it in.

SONYC, run out of NYU's Music and Audio Research Lab, wired up acoustic sensors across the five boroughs and left them running. Each sensor periodically recorded a short clip of whatever was happening outside — a bus idling, a dog barking, someone's speaker turned up too loud — without recording anything intelligible enough to identify a person. Volunteers on the citizen-science platform [Zooniverse](https://zooniverse.org), together with the SONYC research team, then listened to thousands of these clips and tagged which sounds they could hear, using a taxonomy built in consultation with the New York City Department of Environmental Protection (DEP).

The charts below use the **verified subset** of that effort: 1,380 ten-second recordings from 53 sensors where two trained annotators independently tagged each clip and then resolved any disagreement, producing a single, high-confidence label set per recording. To protect privacy, SONYC quantized each recording's location to the city block and its timestamp to the hour — precise enough to ask *when* and roughly *where* New York is noisy, without pinpointing anyone's exact address or moment. Read more about the dataset's design on the [DCASE 2020 Urban Sound Tagging task website](http://dcase.community/challenge2020/task-urban-sound-tagging-with-spatiotemporal-context).

One caveat worth keeping in mind while reading these charts: the sensor network was concentrated in Manhattan, which accounts for 85% of these recordings, versus 14% in Brooklyn and about 1% in Queens. This is a picture of *midtown-and-downtown* New York's soundscape more than the whole city's.

## What New York sounds like

Annotators tagged the presence of 23 fine-grained sound classes, grouped into 8 coarse categories: engines, machinery impacts, non-machinery impacts, powered saws, alert signals, music, human voices, and dogs. The bubble chart below sizes each sound by how often it was tagged present across the verified recordings.

```js
display(renderExplorer({rawRows: rows, width}));
```

Cars dominate. Engine noise and alert signals — mostly horns — together account for a large share of every recording, and human voices show up almost as often. Non-machinery impacts (a category for loud bangs, knocks, and slaps that don't fit any single machine) turn up in nearly one in five clips, more than construction-related sounds like jackhammers or saws.

The most interesting story here, though, is a sound that's almost entirely missing: **car alarms**. They're tagged in exactly one of the 1,380 verified recordings, compared with 157 for car horns and 106 for sirens in the very same alert-signal category. Car alarms are the noise most associated with old New York movie-scene cliché, yet in four years of sensor data they're practically extinct — a small, concrete sign of how much quieter (or better-designed) car alarm systems have become.

## When New York is loud

The radial chart below stacks the same eight categories by hour of day, so you can see each sound's daily rhythm rather than just its total volume.

Click a **legend item**, or the ring itself, to isolate one category and see its hourly total in the center of the chart. Hover anywhere on an isolated ring to see the exact count for that hour. Click again to return to the full view.

The city's rhythm shows up clearly: human voices and engine noise build through the morning, stay high across the working day, and taper off after the evening commute. Sirens follow a similar but noisier pattern, with a visible peak in the early-to-late afternoon — consistent with peak traffic hours rather than, say, late-night emergencies.

## A weekday habit

The radial chart above only shows the hour of day, collapsing all seven days together. Car horns, the single most common alert signal in this dataset, tell a different story once you split by day of week too: **106 of the 157 verified car-horn recordings — about two in three — happened Monday through Friday**, clustering around the morning and evening commute. The heatmap below plots that same count across every combination of day and hour, so the weekday commute pattern is visible directly, the way a GitHub contribution graph shows a coder's weekly rhythm.

## Sources and methodology

Charts on this page are built from SONYC-UST v2.3, citing Cartwright, M., Cramer, J., Mendez, A.E.M., Wang, Y., Wu, H., Lostanlen, V., Fuentes, M., Dove, G., Mydlarz, C., Salamon, J., Nov, O., and Bello, J.P., *SONYC-UST-V2: An Urban Sound Tagging Dataset with Spatiotemporal Context*, DCASE Workshop, 2020. The dataset is distributed under a [CC BY 4.0 license](https://creativecommons.org/licenses/by/4.0/); see `SONYCREADME.md` in this project's repository for the full label taxonomy and column definitions.