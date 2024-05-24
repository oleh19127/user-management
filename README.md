# User Management

This project is a User Management implemented using GraphQL. It includes functionalities for managing users, profiles, and votes. The project utilizes JWT for authentication, PostgreSQL with TypeORM for database interactions.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [GraphQL Schema](#graphql-schema)
- [License](#license)

## Features

### User

- **Signup**: Create a new user account.
- **Signin**: Authenticate a user and obtain a JWT token.
- **Get All Users**: Retrieve a list of all users.
- **Get One User**: Retrieve details of a specific user by ID.
- **Delete User**: Remove a user account.
- **Patch User**: Update user details.
- **Upload Avatar**: Upload and update the user's avatar.

### Profile

- **Get All User Profiles**: Retrieve all profiles associated with a user.
- **Create Profile**: Create a new profile for a user.
- **Update Profile**: Modify details of an existing profile.
- **Delete Profile**: Remove a profile.

### Vote

- **Create Vote**: Create a new vote associated with a profile.

## Technologies Used

- **GraphQL**: For API implementation.
- **JWT + Passport**: For authentication and authorization.
- **PostgreSQL + TypeORM**: For database management and ORM.
- **AWS SDK**: For handling file uploads.
- **Class-validator + Class-transformer**: For ensuring valid data inputs.
