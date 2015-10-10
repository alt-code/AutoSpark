while :
do

  if [ -f ./tmp/job.txt ]
  then
    content=`cat ./tmp/job.txt`
    provider=$(echo $content | cut -f1 -d:)
    name=$(echo $content | cut -f2 -d:)
    count=$(echo $content | cut -f3 -d:)
    size=$(echo $content | cut -f4 -d:)
    key_path=$(echo $content | cut -f5 -d:)

    echo $provider
    echo $name
    echo $count
    echo $size
    echo $key_path
    if [ "$provider" == "aws"]
      cd ../scripts
      ./launch_spark_on_aws.sh $name $count $size $key_path
    then
    elif [ "$provider" == "digitalocean"]
    then
      cd ../scripts
      ./launch_spark_on_do.sh $name $count $size $key_path
    else
      echo "Incorrect value of provider"
    fi 
    rm ./tmp/job.txt
  fi

  echo "Waiting for jobs..."
  sleep 10

done
