terraform {
  backend "s3" {
    bucket = "alexa-skill-my-plants-terraform-backend"
    key    = "terraform.tfstate"
    region = "us-east-1"
  }
}
