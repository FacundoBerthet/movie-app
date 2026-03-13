"""Excepciones de dominio para errores de integracion y recursos inexistentes."""

class UpstreamError(Exception):
    """Error al consumir un servicio externo (TMDB)."""

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


class NotFoundError(Exception):
    """Error cuando un recurso solicitado no existe."""

    def __init__(self, message: str = "Resource not found"):
        self.message = message
        super().__init__(message)