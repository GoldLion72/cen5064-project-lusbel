### Design Patterns
- Factory method: No genuine fit, because there is only one type of "product" (a workout event) where all instance share the same shape.

- Abstract factory: No genuine fit, because I don't see a family of products, as there is only one product which is described in the factory method bullet.

- Builder: No genuine fit, because a workout event object is simple to make, and a JavaScript object can be used to create each one.

- Prototype: No genuine fit, because there is no feature currently that requires cloning an object, such as an existing workout event object.

- Singleton: Genuine fit, especially for the database configuration, where one database instance is used across the entire application in the backend, but it can also be used for configurations, such as the exercise options, which will be used in both ProgressView.vue and WorkoutView.vue in the frontend. workoutOptions.js exports one object and the ES module cache gives every import access to the same instance. Additionally, the object is immutable through the use of Object.freeze() on its properties as well as itself. Immutability and the same instance being reused are separate concerns, but the workoutOptions.js file addresses both. In other words, I wanted a single object isntance to be used throughout the entire browser, and I also don't want to change throughout the application's run.