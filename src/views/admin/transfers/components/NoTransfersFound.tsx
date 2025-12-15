import type React from "react"
import { Text } from "@chakra-ui/react"

export const NoTransfersFound: React.FC = () => {
    return (
        <Text color="gray.400" textAlign="center" mt={4}>
            No se encontraron traspasos para los filtros seleccionados.
        </Text>
    )
}
