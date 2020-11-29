//
//  main.cpp
//  Stack_n_Queue
//
//  Created by Sungmin Gan on 2/24/19.
//  Copyright © 2019 Sungmin Gan. All rights reserved.
//

#include <iostream>

using namespace std;

struct node
{
    int data;
    node *next;
};

class stack
{
private:
    node *top;
    int length;
public:
    stack()
    {
        top = NULL;
        length = 0;
    }
    void addData(int num)
    {
        node *temp = new node;
        temp->data = num;
        temp->next = NULL;
        if(top == NULL)
        {
            top = temp;
            temp = NULL;
            delete temp;
        }
        else
        {
            top->next = temp;
            top = temp;
            temp = NULL;
            delete temp;
        }
    };
    int Top()
    {
        return top->data;
    };
    
};

class queue
{
private:
    node *first, *last;
    int length;
public:
    queue()
    {
        first = NULL;
        last = NULL;
        length = 0;
    }
    void addData(int num)
    {
        node *temp = new node;
        temp->data = num;
        temp->next = NULL;
        if(first==NULL)
        {
            first=temp;
            last=temp;
            temp=NULL;
            length ++;
        }
        else
        {
            last->next=temp;
            last=temp;
            length++;
        }
    }
    int First()
    {
        return first->data;
    }
};

int main(int argc, const char * argv[]) {
    stack testStack;
    testStack.addData(1);
    testStack.addData(2);
    testStack.addData(3);
    cout << testStack.Top() << endl;
    
    queue testQueue;
    testQueue.addData(10);
    testQueue.addData(20);
    testQueue.addData(30);
    cout << testQueue.First() << endl;
}

