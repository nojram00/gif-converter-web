class ByteSizeHelper:
    def __init__(self, byte : bytes) -> None:
        self._byte = byte

    @property
    def size(self):
        return len(self._byte)

    @property
    def kb(self):
        return self.size / 1024

    @property
    def mb(self):
        return self.size / (1024 ** 2)

    @property
    def gb(self):
        return self.size / (1024 ** 3)