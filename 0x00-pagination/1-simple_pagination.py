#!/usr/bin/env python3
"""
0.Simple helper function
"""

import csv
import math
from typing import List

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

class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """Cut piece of information
        """
        assert(type(page) == int and type(page_size) == int)
        assert(page > 0 and page_size > 0)

        first_index, end_index = index_range(page, page_size)
        return self.dataset()[first_index:end_index]