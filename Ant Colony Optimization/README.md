[Check Out the Code Here!](https://github.com/sungmin-gan/AntColonyOptimization/blob/master/ACOvsTSP.py)

**What is the Traveling Salesman Problem?**
The Traveling Salesman Problem asks the following question: "Given a list of cities, and the distances between them, what is the shortest route one can take to visit every city once - and only once - and return to the home city at the end of the trip?" 

**What is Ant Colony Optimization?**
In nature, ants have a peculiar way of finding the shortest route between their nest and their food. First, the colony sends out an exploratory group to scout for food. Once the exploratory group finds a food source, they release pheromones on the way home to mark the path between their nest and the food source. During their return trip, the ants may encounter an obstacle, or their path may split into multiple paths. When this happens, the ants will split up into equal groups, and circumvent the obstacle or take each of the paths. For example, if a group of 100 ants encounter a rock, 50 would go to the left of the rock, and 50 would go to the right of the rock. Generally, if one of the paths happens to be shorter, the amount of pheromones on that route tends to be greater than the amount  on a longer route. Why? Because more ants can travel along a shorter route in a given span of time. Now, imagine that a foraging group coming from the nest encounters the exploratory group at the obstacle. How do they decide which route to take around the rock? They divide themselves in groups proportional to the amount of pheromones on each route. For example, if the shorter route had a pheromone level of 66%, and the longer one 34%, about 66% of the ants will follow the shorter route, and the rest will follow the longer route. This process is repeated over and over as more of the colony is notified of this path to food. As the shorter route is traveled more and more, the amount of pheromones deposited on it becomes stronger and stronger, until finally it becomes established that that is just the best route to take. 

**How is Ant Colony Optimization used to solve the Traveling Salesman Problem?**
The ants used in this AI program have 2 distinct advantages over real ants. One, they will never visit a city that they have visited before. Two, they know the distances between each city, and tend to travel to cities that are closest to them. One feature they share with real ants is that they release pheromones along the routes, and tend to choose routes higher in pheromone content. The combination of these 3 features puts the ants at a high probability to sniff out the shortest round trip in a very short time. With the help of visual tools like Python's Turtle Module, we can see this process in action:

![](https://github.com/sungmin-gan/AntColonyOptimization/blob/master/ACO.gif)

Routes become thicker as they are used more and more, and they change from red, to yellow, to green when the colony starts establishing that route permanently.

[Check Out the Code Here!](https://github.com/sungmin-gan/AntColonyOptimization/blob/master/ACOvsTSP.py)
