# Script execution times

|Method                                                      |Test data          |Time                           |  
|------------------------------------------------------------|-------------------|-------------------------------| 
|**insertMany modulus(%) 1000:**                             |combined_data_1.txt|98536.319ms                    |
|**insertMany modulus(%) 10000:**                            |combined_data_1.txt|117835.981ms                   |
|**insertOne:**                                              |combined_data_1.txt|`JavaScript heap out of memory`|  
|**insertOne with stream pause/resume:**                     |combined_data_1.txt|`JavaScript heap out of memory`|  
|**insertOne with stream pause/resume and async with await:**|combined_data_1.txt|3857698.947ms                  |  
