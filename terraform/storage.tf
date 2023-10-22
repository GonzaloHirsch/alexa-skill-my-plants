resource "aws_s3_bucket" "state" {
  bucket = local.bucket_name

  tags = {
    Name = local.bucket_name
    app  = local.app_tag
  }
}

resource "aws_dynamodb_table" "storage" {
  name = local.dynamo_table_name
  # Set type as provisioned given we don't expect that much of a heavy workload
  billing_mode   = "PROVISIONED"
  read_capacity  = 3
  write_capacity = 3
  # Make sure to 
  hash_key  = "UserId"
  range_key = "PlantName"

  # Attributes for the table items
  attribute {
    name = "UserId"
    type = "S"
  }

  attribute {
    name = "PlantName"
    type = "S"
  }

  tags = {
    Name = local.dynamo_table_name
    app  = local.app_tag
  }
}
