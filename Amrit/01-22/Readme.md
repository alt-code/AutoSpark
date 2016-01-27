## Experiment 1
Don't use big of a configuration. Use like 3 nodes with 4-6 GB of Ram.
Keep contents of this folder (01-22) in any single folder. This took more than 20 hours to run on a single machine without any parallization of datasets.
You will need following packages to run these scripts if not installed.
For pip (if pip is there) install on an ubuntu machine, these are the package names, install in this same order.
- pip install -U numpy
- pip install -U scipy
- pip install -U scikit-learn
- sudo apt-get install python-matplotlib

Download this dataset from [here] (https://drive.google.com/file/d/0B6L_ShRNMys7cEl1U0xxRGw5NFU/view?usp=sharing). Keep the extracted files in the 'dataset' folder. In this 'dataset' folder remove the 'readme.md' file

Then Run this command
```
python shingle_aws.py _test
```

## Experiment 2
I need to know few details on how can we parallize the scripts on aws and converge them together.
On HPC, better runtime was achieved by parallelizing the datasets at runtime and collecting the results back again.
