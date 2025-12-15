import { Box, Flex, Text, Select, useColorModeValue } from '@chakra-ui/react';
import {
  getDashboardCounts,
  DashboardCounts,
} from '../../../../api/DashboardApi';
import React, { useEffect, useState } from 'react';

// Custom components
import Card from 'components/card/Card';
import PieChart from 'components/charts/PieChart';
import { pieChartOptions } from 'variables/charts';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
export default function Conversion(props: { [x: string]: any }) {
  const { ...rest } = props;

  // Chakra UI - colores
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardColor = useColorModeValue('white', 'navy.700');

  // Estado
  const [counts, setCounts] = useState<DashboardCounts[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Fetch API
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await getDashboardCounts();
        setCounts(response);
      } catch (error) {
        console.error('Error fetching dashboard counts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  useEffect(() => {
    window.openPieModal = onOpen;
    return () => {
      delete window.openPieModal;
    };
  }, [onOpen]);

  // Filtrado y formato
  const filteredCounts = counts
    .filter((item) => Number(item.total) > 0)
    .map((item) => ({
      label: item.nombre,
      value: Number(item.total),
    }));

  const pieChartData = filteredCounts.map((item) => item.value);
  const pieChartLabels = filteredCounts.map((item) => item.label);

  const colors = [
    '#0059ae',
    '#ef4444',
    '#c4bf21',
    '#5a21c4',
    '#ffdb70',
    '#c42170',
    '#c47021',
    '#24c421',
    '#33cdeb',
    '#2e81c9',
    '#ee6f93',
    '#61a152',
    '#d2a82d',
    '#a3a3a3',
  ];

  const percent = (value: number) => {
    const total = filteredCounts.reduce((acc, item) => acc + item.value, 0);
    return total > 0
      ? `${Math.round((value / total) * 100).toFixed(1)}%`
      : '0%';
  };

  return (
    <Card
      p="20px"
      alignItems="center"
      flexDirection="column"
      w="100%"
      {...rest}
    >
      {/* Header */}
      <Flex
        px={{ base: '0px', '2xl': '10px' }}
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        mb="8px"
      >
        <Box>
          <Text fontSize="xl" fontWeight="bold" color="type.title">
            Bienes por Subgrupo
          </Text>
          <Text fontSize="sm" color="gray.500">
            Distribución porcentual por categoría
          </Text>
        </Box>
      </Flex>

      {/* PieChart */}
      <PieChart
        h="100%"
        w="100%"
        chartData={pieChartData}
        chartOptions={{
          ...pieChartOptions,
          labels: pieChartLabels,
          colors: colors,
          legend: { show: false },
        }}
      />
      <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Porcentajes por categoría</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {filteredCounts.map((item, index) => (
              <Flex key={index} align="center" mb={2}>
                <Box
                  h="10px"
                  w="10px"
                  bg={colors[index % colors.length]}
                  borderRadius="full"
                  mr={3}
                />
                <Text flex="1" fontWeight="500" fontSize="sm">
                  {item.label}
                </Text>
                <Text fontWeight="bold" fontSize="sm">
                  {percent(item.value)}
                </Text>
              </Flex>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Card>
  );
}
