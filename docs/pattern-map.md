### Design Patterns
- Factory method: ProgressExerciseFactory.js somewhat applies this pattern, in the sense that the ProgressExerciseFactory uses a function that returns a certain object based on the metric being used. The object has access to the getExercises method, which uses slightly different SQL based on the metric. The family of “products” in this case would be the exercise SQL queries. However, the Open/Closed principle is not taken care of, because of the switch statement involved. Another metric would mean adding another case to the switch statement.

- Abstract factory: No genuine fit, because I don't see a family of products, as there is only one product which is described in the factory method bullet.

- Builder: No genuine fit, because a workout event object is simple to make, and a JavaScript object can be used to create each one.

- Prototype: No genuine fit, because there is no feature currently that requires cloning an object, such as an existing workout event object.

- Singleton: Genuine fit, especially for the database configuration, where one database instance is used across the entire application in the backend (db/index.js), but it can also be used for configurations, such as the exercise options, which is used in both ProgressView.vue and WorkoutView.vue in the frontend (config/workoutOptions.js). useAuth.js also uses this pattern, because useAuth always returns the same auth store with createAuthStore().