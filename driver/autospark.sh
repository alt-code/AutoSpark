

echo "Welcome to AutoSpark"
echo "select one of the options: launch_cluster / load_data / submit_job/ teardown_cluster"

echo -n "Task > "
read task

if [ $task == "launch_cluster" ]
then
    echo "Calling Launch cluster script"
    node autospark-cluster-launcher.js

elif [ $task == "load_data" ]
then
    echo "Calling Load Data script"
    node autospark-load.js

elif [ $task == "submit_job" ]
then
    echo "Calling Submit Job script"
    ./autospark-submit.sh

elif [ $task == "teardown_cluster" ]
then
    echo "Calling Tear Down Script"
    node autospark-teardown.js

else
    echo "Incorrect Argument: Try Again"
fi
