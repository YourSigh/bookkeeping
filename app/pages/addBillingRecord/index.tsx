import {
  View,
  Text,
  PanResponder,
  Animated,
  Dimensions,
} from "react-native";
import { useState } from "react";

import { BaseTab } from "@/components/Base";

const AddBillingRecord = () => {
  const [tabValue, setTabValue] = useState(1);
  const panes = [
    {id: 1, title: '支出'},
    {id: 2, title: '收入'},
  ]
  const onChange = (value: number) => {
    setTabValue(value);
  }
  return (
    <View style={{flex: 1}}>
      <BaseTab value={tabValue} panes={panes} onChange={onChange} content={(<Text>{panes.find(i => i.id === tabValue)?.title}</Text>)}></BaseTab>
    </View>
  );
};

export default AddBillingRecord;