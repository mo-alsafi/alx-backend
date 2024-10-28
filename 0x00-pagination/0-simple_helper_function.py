#!/usr/bin/env python3
"""
0.Simple helper function
"""

def index_range(page, page_size):
    """The function should return a tuple of size two 
    containing a start index and an end index 
    corresponding to the range of indexes to 
    return in a list for those particular 
    pagination parameters.
    """
    last_index = page * page_size
    if(page == 1):
        first_index = 0
    first_index = last_index - page_size
    return (first_index, last_index)

