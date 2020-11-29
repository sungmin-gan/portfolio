//
//  main.cpp
//  Stack_ReverseAndCopy
//
//  Created by Sungmin Gan on 4/8/19.
//  Copyright © 2019 Sungmin Gan. All rights reserved.
//

#include <iostream>
using namespace std;

struct node{
    int data;
    node *next;
};

class stack
{
private:
    int size;
    node *first, *last;
public:
    stack(){
        size = 0;
        first = NULL;
        last = NULL;
    }
    void addToStack(int integer)
    {
        node *temp = new node;
        temp->data = integer;
        temp->next = NULL;
        if(first == NULL)
        {
            size += 1;
            first = temp;
            last = temp;
            temp = NULL;
        }
        else{
            size += 1;
            temp->next = last;
            last = temp;
            temp = NULL;
        }
    }
    void printStack()
    {
        node *current = new node;
        current = last;
        for (int i = 0; i < size; i++)
        {
            cout << current->data << endl;
            current = current->next;
        }
        current = NULL;
    }
    void printStackReverse()
    {
        node *current = new node;
        current = last;
        int *data;
        data = new int[size];
        for (int i = 0; i < size; i++)
        {
            data[i] = current->data;
            current = current->next;
        }
        for (int i = size-1; i >= 0; i--)
        {
            cout << data[i] << endl;
        }
    }
    void reverseFour()
    {
        
        
        node *pointer = new node;
        if(size > 4)
        {
            node *splitPoint = new node;
            splitPoint = last;
            
            node* *nodesToReverse;
            nodesToReverse = new node* [4];
            
            for (int i = 0; i < size - 5; i++)
            {
                splitPoint = splitPoint->next;
            }
            pointer = splitPoint;
            for(int i = 0; i < 3; i++)
            {
                ((*(&nodesToReverse)))[i] = pointer->next;
                pointer = pointer->next;
            }
            (*(&nodesToReverse))[3] = pointer->next;
            for(int i = 3; i > 0; i--)
            {
                splitPoint->next = (*(&nodesToReverse))[i];
                splitPoint = splitPoint->next;
            }
            splitPoint->next = (*(&nodesToReverse))[0];
            
            delete [] nodesToReverse;
            splitPoint = NULL;
            pointer = NULL;
        }
        else{
            node* *nodesToReverse;
            nodesToReverse = new node* [size];
            
            pointer = last;
            (*(&nodesToReverse))[0] = pointer;
            for(int i = 1; i < size-1; i++)
            {
                (*(&nodesToReverse))[i] = pointer->next;
                pointer = pointer->next;
            }
            (*(&nodesToReverse))[size-1] = pointer->next;
            
            last = (*(&nodesToReverse))[size-1];
            node *current = new node;
            current = last;
            
            for(int i = size - 2; i > 0; i--)
            {
                current->next = (*(&nodesToReverse))[i];
                current = current->next;
            }
            current->next = (*(&nodesToReverse))[0];
            
            delete [] nodesToReverse;
            current = NULL;
            pointer = NULL;
            
        }
        
    }
};

int main(int argc, const char * argv[]) {
    stack Stack;
    Stack.addToStack(1);
    Stack.addToStack(2);
    Stack.addToStack(3);
    Stack.addToStack(4);
    //Stack.addToStack(5);
    //Stack.addToStack(6);
    Stack.printStack();
    Stack.reverseFour();
    Stack.printStack();
}
