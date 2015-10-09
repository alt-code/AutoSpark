echo "###############################################"
echo "#####    Welcome to AutoSpark Launcher    #####"
echo "###############################################"
echo ""

echo "Only aws and digitalocean available !"
echo ""
echo -n "Enter Provider's Name > "
read provider

echo ""

if [ "$provider" = "digitalocean" ]
then
    echo "Info: digitalocean provider selected"
    echo "Three cluster sizes available: small / medium/ large"
    echo ""

    echo -n "Choose one cluster size or use custom > "
    read cluster_size

    echo ""

    if [ "$cluster_size" = "small" ]
    then
        echo "Info: Small Cluster Size selected"

    elif [ "$cluster_size" = "medium" ]
    then
        echo "Info: Medium Cluster Size selected"

    elif [ "$cluster_size" = "large" ]
    then
        echo "Info: Large Cluster Size selected"

    elif [ "$cluster_size" = "custom" ]
    then
        echo "Info: Custom Selected"
    else
        echo "Error: incorrect choice"
    fi

elif [ "$provider" = "aws" ]
then
    echo "Info: aws provider selected"
    echo "Three cluster sizes available: small / medium/ large"
    echo ""

    echo -n "Choose one cluster size or use custom > "
    read cluster_size

    echo -n "Enter cluster name > "
    read clustername

    echo -n "Enter complete path to ssh private key > "
    read key_path
    echo ""

    if [ "$cluster_size" = "small" ]
    then
        echo "Info: Small Cluster Size selected"
        ./launch_spark_on_aws.sh $clustername 4 t2.small $key_path

    elif [ "$cluster_size" = "medium" ]
    then
        echo "Info: Medium Cluster Size selected"
        ./launch_spark_on_aws.sh $clustername 4 t2.medium $key_path

    elif [ "$cluster_size" = "large" ]
    then
        echo "Info: Large Cluster Size selected"
        ./launch_spark_on_aws.sh $clustername 4 t2.large $key_path

    elif [ "$cluster_size" = "custom" ]
    then
        echo "Info: Custom Selected"
        echo -n "Enter Number of Nodes > "
        read count
        echo -n "Enter the aws instance type > "
        read size
        ./launch_spark_on_aws.sh $clustername $count $size $key_path
    else
        echo "Error: incorrect choice"
    fi

else
    echo "Unknown provider"
    echo "Only aws or digitalocean available"
fi
