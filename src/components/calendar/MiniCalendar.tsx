import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'assets/css/MiniCalendar.css';
import { Text, Icon } from '@chakra-ui/react';
// Chakra imports
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
// Custom components
import Card from 'components/card/Card';
type CalendarValue = Date | [Date, Date] | null;
export default function MiniCalendar(props: {
  selectRange: boolean;
  [x: string]: any;
}) {
  const { selectRange, ...rest } = props;
  const [value, setValue] = useState<CalendarValue>(new Date());
  const handleChange = (
    value: CalendarValue,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setValue(value);
    alert('New date is: ' + value);
  };
  return (
    <Card
      alignItems="center"
      flexDirection="column"
      w="100%"
      maxW="max-content"
      p="20px 15px"
      h="max-content"
      {...rest}
    >
      <Calendar
        onChange={handleChange}
        value={value}
        selectRange={selectRange}
        view={'month'}
        tileContent={<Text color="type.bgbutton" />}
        prevLabel={<Icon as={MdChevronLeft as React.ElementType} w="24px" h="24px" mt="4px" />}
        nextLabel={<Icon as={MdChevronRight as React.ElementType} w="24px" h="24px" mt="4px" />}
      />
    </Card>
  );
}
