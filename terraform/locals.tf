locals {
  payload_name       = "build.zip"
  app_tag            = "my-plants.alexa.gonzalohirsch.com"
  base_name          = "alexa-skill-my-plants"
  short_name         = "alexa-my-plants"
  function_name      = local.base_name
  bucket_name        = "${local.base_name}-terraform-backend"
  dynamo_table_name  = "${local.base_name}-table"
  role_name          = "${local.base_name}-lambda-role"
  policy_dynamo_name = "policy-${local.short_name}-lambda-dynamod"
  policy_logs_name   = "policy-${local.short_name}-lambda-execution"
  target_location    = "../.build/${local.payload_name}"
  package_excludes   = [".github", ".git", ".build", ".releaserc.json", ".env", ".eslintrc.json", "docs", ".prettierrc", "terraform", ".gitignore", "README.md", "LICENSE"]
}
