import math 
import random
import turtle 

### Turtle Functions ###
s = turtle.getscreen()
ant = turtle.Turtle()
ant.shape("circle")
ant.shapesize(0.9,0.9,0)
antSpeed = "normal"

totalPopulation = 0 # Later set to number of ants times number of rounds

def drawCities(cityMatrix): # Draw each city as circles with index number
  style = ("Courier", 30)
  ant.pensize(4)
  for i in range(len(cityMatrix)):
    ant.up()

    ant.goto(cityMatrix[i][0],cityMatrix[i][1])
    ant.down()
    ant.circle(30)
    ant.write(i,font=style)
    
def initAnt(cityMatrix):
    ant.speed(antSpeed)
    ant.up()
    ant.goto(cityMatrix[0][0],cityMatrix[0][1])
    ant.down()

def changeLineStyle(frequency):
    ant.pensize(1+(2*frequency/totalPopulation)*10) #Make line width relative to route frequency
    if frequency < .7*totalPopulation*0.33: # Chance line color depending on route frequency
        ant.pencolor("red")
    elif frequency < .7*totalPopulation*0.67:
        ant.pencolor("yellow")
    else:
        ant.pencolor("green")

### Helper Functions ###

def displayMatrix(matrix):
  rows = len(matrix)
  cols = len(matrix[0])
  for x in range(rows):
    print("\n")
    print(x,"| ", end=" ")
    for y in range(cols):
      print(matrix[x][y], ",", end=" ")
      
def displayDistanceMatrix():
  print("\n\nDistance Matrix")
  displayMatrix(distanceMatrix)
  
def displayPheromoneMatrix():
  print("\n\nPheromone Matrix")
  displayMatrix(pheromoneMatrix)
  
def displayRouteFrequencyMatrix():
  print("\n\nRoute Frequency Matrix")
  displayMatrix(routeFrequencyMatrix)


### Input cities and their coordinates ###

numberOfCities = 0
citiesList = []
cityCoordsMatrix = []

def loadCities():
  print("Please input city data (name x-coord y-coord) in this format: city x y\n")
  print("Do not include punctuation. Input errors require program restart.")
  for z in range(numberOfCities):
    city, x, y = input(str(z)+". Enter (City x y): ").split()
    citiesList.append(city)
    cityCoordsMatrix.append([int(x),int(y)])
    
def displayCitiesInfo():
  print("[city x y]: \n")
  for i in range(numberOfCities):
    print(citiesList[i], cityCoordsMatrix[i][0], cityCoordsMatrix[i][1], "\n")

### Calculate distance from coordinates and create matrix

distanceMatrix = []

def calculateDistance(coord1, coord2):
  return round(math.sqrt((coord1[1]-coord2[1])**2+(coord1[0]-coord2[0])**2),2)
  
def fillDistanceMatrix():
  for i in range(numberOfCities):
    distanceMatrix.append([calculateDistance (cityCoordsMatrix[i], cityCoordsMatrix[0])])
    for j in range(1,numberOfCities):
        distanceMatrix[i].append( calculateDistance (cityCoordsMatrix[i], cityCoordsMatrix[j]) )

### Initalize matrices and data for traveling routes ###

routeFrequencyMatrix = [] #Stores number of times each route is visited
pheromoneMatrix = [] # Stores pheromone levels per route

alpha = 1 # Controls influence of pheromones on decision making
beta = 1  # Controls influence of distance. 

### Sub functions for running a single trip. ###

tripsLog = [] # Records every trip
isFirstRound = True # Omits influence of pheromones on very first round
        
def calculatePheromones(currNode, nextNode):
  return (pheromoneMatrix[currNode][nextNode] + pheromoneMatrix[nextNode][currNode])**alpha

def calculateVisibility(currNode, nextNode):            # Visibility = measure of how close next node is from current
  return (1/distanceMatrix[currNode][nextNode])**beta   # Higher visibility = geographically closer
  
def calculateFitness(route, routes, firstTrip):
  aggFactor = 0
  if firstTrip:                      # If firstTrip:
    selfFactor = route["visibility"] # Only use visibility for fitness 
    for i in range(len(routes)):
      aggFactor += routes[i]["visibility"]
    route["fitness"] = selfFactor/aggFactor
  else:                                                             # Otherwise:
    selfFactor = route["pheromones"]*route["visibility"]            # Route's pheromone**alpha * visibility**beta
    for i in range(len(routes)):
      aggFactor += routes[i]["pheromones"]*routes[i]["visibility"]  # divided by aggregate of all routes' pher**alpha * vis**beta
    route["fitness"] = selfFactor/aggFactor                         # equals fitness. 
  
def chooseRoute(validRoutes):                   # Standard relative probability selection 
  randomNumber = random.randint(1,100)/100
  routeFound = False
  previousLimit = 0
  for i in range(len(validRoutes)):
    if randomNumber <= previousLimit + validRoutes[i]["fitness"]:
      routeFound = True
      return validRoutes[i]
    else:
      previousLimit += validRoutes[i]["fitness"]
  if routeFound == False:
    return validRoutes[len(validRoutes)-1]
        
def removeRoute(nextNode, routesList):          # Remove node from "valid next nodes" when selected                            
  for i in range(len(routesList)):
    if routesList[i]["nextNode"] == nextNode:
      del routesList[i]
      return None
      
def updateFrequencyMatrix(prevNode, nextNode):
  routeFrequencyMatrix[prevNode][nextNode] += 1
  
def loadInitialRoutes():
  routes = []
  for i in range(numberOfCities-1):
    routes.append({"nextNode": i+1})
  return routes

### To run a single trip ###

def runTrip():
  
  thisTrip = [0]
  availableRoutes = loadInitialRoutes()
  currNode = 0
  nextNode = None
  # For each route possibility (there are n-1 possible routes per trip, where n=number of nodes)
  for i in range(numberOfCities-1):  
    for j in range(len(availableRoutes)): # calculate influence factors
      availableRoutes[j]["pheromones"] = calculatePheromones(currNode, availableRoutes[j]["nextNode"]) 
      availableRoutes[j]["visibility"] = calculateVisibility(currNode, availableRoutes[j]["nextNode"])
    for k in range(len(availableRoutes)): # calculate fitness 
      calculateFitness(availableRoutes[k], availableRoutes, isFirstRound)
    nextRoute = chooseRoute(availableRoutes) # choose a route
    nextNode = nextRoute["nextNode"]
    thisTrip.append(nextNode) # record the route
    updateFrequencyMatrix(currNode, nextNode) 
    changeLineStyle(routeFrequencyMatrix[currNode][nextNode])
    removeRoute(nextNode, availableRoutes) # remove chosen route as valid destination
    if i == numberOfCities-2: # if one city, left go home
      ant.goto(cityCoordsMatrix[nextNode][0],cityCoordsMatrix[nextNode][1])
      currNode = nextNode
      nextNode = 0
    else:                     # otherwise prep for next route of trip
      ant.goto(cityCoordsMatrix[nextNode][0],cityCoordsMatrix[nextNode][1])
      currNode = nextNode
      nextNode = None
  updateFrequencyMatrix(currNode, nextNode)
  ant.goto(cityCoordsMatrix[nextNode][0],cityCoordsMatrix[nextNode][1])
  tripsLog.append(thisTrip)
  
### To run a round ###

Q = 5        # Quantity; determines potency of pheromones; or, how much deposited per unit length
pDecay = 0.5 # How much pheromone REMAINS after one unit of time (this case after each round)

numberOfAnts = 0 # How many ants will travel the routes this round (how many trips/round)

def updatePheromoneMatrix():
  for i in range(numberOfCities):
    for j in range(numberOfCities):
      # if first round don't include 'prior' pheromones in calculations
      if distanceMatrix[i][j] != 0 and isFirstRound:
        pheromoneMatrix[i][j] = routeFrequencyMatrix[i][j]*(Q/distanceMatrix[i][j]) 
       # next round lvl = prev round level * decay rate * quantity traveled * Q / length of route 
      if distanceMatrix[i][j] != 0 and isFirstRound == False:
        pheromoneMatrix[i][j] = pheromoneMatrix[i][j]*(pDecay)*routeFrequencyMatrix[i][j]*(Q/distanceMatrix[i][j]) 
      
def runRound():
  initAnt(cityCoordsMatrix)
  for i in range(numberOfAnts):
    runTrip()
    updatePheromoneMatrix()
      
### To run a sim ###
print("-----------------------------------------------------")
print("| Welcome to the Ant Colony Optimization Simulator! |")
print("-----------------------------------------------------\n")


validResponseDemo = False

while validResponseDemo == False:
  print("The creator of this program has a suggested list of cities that best demonstrate this simulation. Would you like to try it? y/n: ")
  demoResponse = input()
  if demoResponse == 'y':
    validResponseDemo = True
    numberOfCities = 10
    citiesList = ["CA","WA", "WY", "IL", "NY", "KY", "AR", "FL", "NM", "MX"]
    cityCoordsMatrix = [[-300,0],[-225,250],[-150,150],[0,75],[300,250],[300,0],[0,-75],[300,-250],[-150,-150],[-225,-250]]
    print("Great. Here's some info about the cities. \n")
    displayCitiesInfo()
    
  elif demoResponse =='n' :
    validResponseDemo = True
    numberOfCities = int(input("\nThat's fine too! How many cities would you like to input? : "))
    loadCities()
    
  else:
    print("I'm sorry, that's not an input I was expecting. Can you try again?")

pheromoneMatrix =[[0]*numberOfCities for i in range(numberOfCities)]
routeFrequencyMatrix = [[0]*numberOfCities for i in range(numberOfCities)]        
drawCities(cityCoordsMatrix)
fillDistanceMatrix()

numberOfRounds = int(input("\nHow many rounds would you like to run? : "))
numberOfAnts = int(input("\nHow many ants will travel each round? : "))
totalPopulation = numberOfAnts*numberOfRounds

validResponseSpeed = False
while validResponseSpeed == False:
  print("Finally, choose the ants' speed- \n{'normal', 'fast', 'fastest', 'slow', 'slowest'}: \n")
  speedResponse = input()
  if speedResponse == "normal" or "fast" or "fastest" or "slow" or "slowest":
    validResponseSpeed = True
    antSpeed = speedResponse
  else:
    print("I'm sorry, that's not an input I was expecting. Can you try again?")
    


print("\nStarting...\n")
for i in range(numberOfRounds):
  print("\n\n---- Round", i+1, "----")
  runRound()
  isFirstRound = False;
  displayRouteFrequencyMatrix()
  displayPheromoneMatrix()















  

  


  

      









      



    

 

  




    
     
    
