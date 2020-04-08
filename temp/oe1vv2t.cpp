#include<bits/stdc++.h>
using namespace std;
#define N 7
int board[N][N];

void display(){

        for(int i=0;i<N;i++){
                    for(int j=0;j<N;j++)
                    cout<<board[i][j]<<" ";
                    cout<<endl;
        }


}
bool isSafe(int row, int col) 
{ 
    int i, j; 
  
    /* Check this row on left side */
    for (i = 0; i < col; i++) 
        if (board[row][i]) 
            return false; 
  
    /* Check upper diagonal on left side */
    for (i = row, j = col; i >= 0 && j >= 0; i--, j--) 
        if (board[i][j]) 
            return false; 
  
    /* Check lower diagonal on left side */
    for (i = row, j = col; j >= 0 && i < N; i++, j--) 
        if (board[i][j]) 
            return false; 
  
    return true; 
} 

bool solve(int col){

if(col>=N)
return true; 

for(int i=0;i<N;i++){

      if(isSafe(i,col)){
        board[i][col]=1;

            if(solve(col+1))
                return true;

        board[i][col]=0;
       }
}
return false;
}


int main(){


for(int i=0;i<N;i++)
for(int j=0;j<N;j++)
board[i][j]=0;
if(solve(0))
display();
    cout<<"HELLO";
    return 1;
}