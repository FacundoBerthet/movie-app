class UpstreamError(Exception):
    def __init__(self, message: str):
        self.message = message
        super().__init__(message)

class NotFoundError(Exception):
    def __init__(self, message: str = "Resource not found"):
        self.message = message
        super().__init__(message)