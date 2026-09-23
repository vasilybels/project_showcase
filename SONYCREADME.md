# SONYC Urban Sound Tagging (SONYC-UST): a multilabel dataset from an urban acoustic sensor network
Version 2.3, September 2020

## Created by
Mark Cartwright (1,2,3), Jason Cramer (1), Ana Elisa Mendez Mendez (1), Yu Wang (1), Ho-Hsiang Wu (1), Vincent Lostanlen (1,2,4), Magdalena Fuentes (1), Graham Dove (2), Charlie Mydlarz (1, 2), Justin Salamon (1,5), Oded Nov (6), Juan Pablo Bello (1,2,3)

1. Music and Audio Resarch Lab, New York University
2. Center for Urban Science and Progress, New York University
3. Department of Computer Science and Engineering, New York University
4. Cornell Lab of Ornithology
5. Adobe Research
6. Department of Technology Management and Innovation, New York University

## Publication
If using this data in an academic work, please reference the DOI and version, as well as cite the following paper, which presented the data collection procedure and the first version of the dataset:

Cartwright, M., Cramer, J., Mendez, A.E.M., Wang, Y., Wu, H., Lostanlen, V., Fuentes, M., Dove, G., Mydlarz, C., Salamon, J., Nov, O., Bello, J.P. SONYC-UST-V2: An Urban Sound Tagging Dataset with Spatiotemporal Context. In *Proceedings of the Workshop on Detection and Classification of Acoustic Scenes and Events (DCASE)*, 2020.
[pdf](https://arxiv.org/abs/2009.05188)

## Description
SONYC Urban Sound Tagging (SONYC-UST) is a dataset for the development and evaluation of machine listening systems for realistic urban noise monitoring. The audio was recorded from the [SONYC](https://wp.nyu.edu/sonyc) acoustic sensor network. Volunteers on the  [Zooniverse](https://zooniverse.org) citizen science platform tagged the presence of 23 classes that were chosen in consultation with the New York City Department of Environmental Protection. These 23 fine-grained classes can be grouped into 8 coarse-grained classes. The recordings are split into three sets: training, validation, and test. The training and validation sets are disjoint with respect to the sensor from which each recording came, and the test set is displaced in time. For increased reliability, three volunteers annotated each recording. In addition, members of the SONYC team subsequently created a subset of verified, ground-truth tags using a two-stage annotation procedure in which two annotators independently tagged and then collectively resolved any disagreements. This subset of recordings with verified annotations intersects with all three recording splits. All of the recordings in the test set have these verified annotations. In v2 version of this dataset, we have also included coarse spatiotemporal context information to aid in tag prediction when time and location is known. For more details on the motivation and creation of this dataset see the [DCASE 2020 Urban Sound Tagging with Spatiotemporal Context Task website](http://dcase.community/challenge2020/task-urban-sound-tagging-with-spatiotemporal-context).

## Audio data
The provided audio has been acquired using the SONYC acoustic sensor network for urban noise pollution monitoring. Over 60 different sensors have been deployed in New York City, and these sensors have collectively gathered the equivalent of over 50 years of audio data, of which we provide a small subset. The data was sampled by selecting the nearest neighbors on VGGish features of recordings known to have classes of interest. All recordings are 10 seconds and were recorded with identical microphones at identical gain settings. To maintain privacy, we quantized the spatial information to the level of a city block, and we quantized the temporal information to the level of an hour. We also limited the occurrence of recordings with positive human voice annotations to one per hour per sensor.

## Label taxonomy
The label taxonomy is as follows:
1. engine
    1: small-sounding-engine
    2: medium-sounding-engine
    3: large-sounding-engine
    X: engine-of-uncertain-size
2. machinery-impact
    1: rock-drill
    2: jackhammer
    3: hoe-ram
    4: pile-driver
    X: other-unknown-impact-machinery
3. non-machinery-impact
    1: non-machinery-impact
4. powered-saw
    1: chainsaw
    2: small-medium-rotating-saw
    3: large-rotating-saw
    X: other-unknown-powered-saw
5. alert-signal
    1: car-horn
    2: car-alarm
    3: siren
    4: reverse-beeper
    X: other-unknown-alert-signal
6. music
    1: stationary-music
    2: mobile-music
    3: ice-cream-truck
    X: music-from-uncertain-source
7. human-voice
    1: person-or-small-group-talking
    2: person-or-small-group-shouting
    3: large-crowd
    4: amplified-speech
    X: other-unknown-human-voice
8. dog
    1: dog-barking-whining

The classes preceded by an `X` code indicate when an annotator was able to identify the coarse class, but couldn't identify the fine class because either they were uncertain which fine class it was or the fine class was not included in the taxonomy. `dcase-ust-taxonomy.yaml` contains this taxonomy in an easily machine-readable form.

## Data splits
This release contains a training subset (13538 recordings from 35 sensors), and validation subset (4308 recordings from 9 sensors), and a test subset (664 recordings from 48 sensors). The training and validation subsets are disjoint with respect to the sensor from which each recording came. The sensors in the test set will not disjoint from the training and validation subsets, but the test recordings are displaced in time, occurring after any of the recordings in the training and validation subset. The subset of recordings with verified annotations (1380 recordings) intersects with all three recording splits. All of the recordings in the test set have these verified annotations. 

## Annotation data
The annotation data are contained in annotations.csv, and encompass the training, validation, and test subsets. Each row in the file represents one multi-label annotation of a recording---it could be the annotation of a single citizen science volunteer, a single SONYC team member, or the agreed-upon ground truth by the SONYC team (see the annotator_id column description for more information). Note that since the SONYC team members annotated each class group separately, there may be multiple annotation rows by a single SONYC team annotator for a particular audio recording.

### Columns

*split*

: The data split. (*train*, *validate*)

*sensor\_id*

: The ID of the sensor the recording is from.

*audio\_filename*
: The filename of the audio recording

*annotator\_id*
: The anonymous ID of the annotator. If this value is positive, it is a citizen science volunteer from the Zooniverse platform. If it is negative, it is a SONYC team member. If it is `0`, then it is the ground truth agreed-upon by the SONYC team.

*year*
: The year the recording is from.

*week*
: The week of the year the recording is from.

*day*
: The day of the week the recording is from, with Monday as the start (i.e. `0`=Monday).

*hour*
: The hour of the day the recording is from

*borough*
: The NYC borough in which the sensor is located (`1`=Manhattan, `3`=Brooklyn, `4`=Queens). This corresponds to the first digit in the 10-digit NYC parcel number system known as Borough, Block, Lot (BBL).

*block*
: The NYC block in which the sensor is located. This corresponds to digits 2—6 digit in the 10-digit NYC parcel number system known as Borough, Block, Lot (BBL).

*latitude*
: The latitude coordinate of the **block** in which the sensor is located.

*longitude*
: The longitude coordinate of the **block** in which the sensor is located.

*<coarse\_id\>-<fine_id\>\_<fine_name\>_presence*
: Columns of this form indicate the presence of fine-level class. `1` if present, `0` if not present. If `-1`, then the class was not labeled in this annotation because the annotation was performed by a SONYC team member who only annotated one coarse group of classes at a time when annotating the verified subset.

*<coarse\_id\>\_<coarse\_name\>\_presence*
: Columns of this form indicate the presence of a coarse-level class. `1` if present, `0` if not present. If `-1`, then the class was not labeled in this annotation because the annotation was performed by a SONYC team member who only annotated one coarse group of classes at a time when annotating the verified subset. These columns are computed from the fine-level class presence columns and are presented here for convenience when training on only coarse-level classes.

*<coarse\_id\>-<fine_id\>\_<fine_name\>\_proximity*
: Columns of this form indicate the proximity of a fine-level class. After indicating the presence of a fine-level class, citizen science annotators were asked to indicate the proximity of the sound event to the sensor. Only the citizen science volunteers performed this task, and therefore this data is not included in the verified annotations. This column may take on one of the following four values: (`near`, `far`, `notsure`, `-1`). If `-1`, then the proximity was not annotated because either the annotation was not performed by a citizen science volunteer, or the citizen science volunteer did not indicate the presence of the class.


## Conditions of use
Dataset created by Mark Cartwright, Jason Cramer, Ana Elisa Mendez Mendez, Yu Wang, Ho-Hsiang Wu, Vincent Lostanlen, Magdalena Fuentes, Graham Dove, Charlie Mydlarz, Justin Salamon, Oded Nov, and Juan Pablo Bello

The SONYC-UST dataset is offered free of charge under the terms of the Creative  Commons Attribution 4.0 International (CC BY 4.0) license:
https://creativecommons.org/licenses/by/4.0/

The dataset and its contents are made available on an "as is" basis and without  warranties of any kind, including without limitation satisfactory quality and  conformity, merchantability, fitness for a particular purpose, accuracy or  completeness, or absence of errors. Subject to any liability that may not be excluded or limited by law, New York University is not liable for, and expressly excludes all liability for, loss or damage however and whenever caused to anyone by any use of the SONYC-UST dataset or any part of it.

## Feedback
Please help us improve SONYC-UST by sending your feedback to:
* Mark Cartwright: mcartwright@gmail.com

In case of a problem, please include as many details as possible.

## Acknowledgments
We would like to thank all the Zooniverse volunteers who continue to contribute to our project. This work is supported by [National Science Foundation award 1544753](https://www.nsf.gov/awardsearch/showAward?AWD_ID=1544753).

## Change log
* 2.3 Added the ground truth annotations for the test set, and regrouped the audio files for upload to Zenodo.
* 2.2 Added the audio for the test set (audio-eval.tar.gz).
* 2.1 The DCASE 2020 development dataset. 14778 new recordings added along with coarse spatiotemporal context information.
* 1.0 Data is the same as v0.4. Publication added to README.
* 0.4 Fixed error in annotations. Previously, the coarse class "machinery-impact" was accidentally indicated as present whenever "non-machinery-impact" was present regardless of the presence of "machinery-impact". This error has been fixed.
* 0.3 Test set annotations added
* 0.2 Test set audio files added

