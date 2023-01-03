rm Archive.zip 2> /dev/null
zip -rq Archive.zip *
aws lambda update-function-code --function-name DynamoElasticsearch --zip-file fileb://Archive.zip --profile blocksync