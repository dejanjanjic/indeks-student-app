import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
  } from "react-native";
  import Icon from "react-native-vector-icons/FontAwesome";

  const ReportedProblemGenericComponent = ({ title, iconName, count, onPress }) => {
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
        <View style={styles.iconContainer}>
          {iconName && <Icon name={iconName} style={styles.icon} />}
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.itemTitle}>{title}</Text>
        </View>
        {count !== undefined && (
          <View style={styles.countContainer}>
            <Text style={[styles.countText, { color:"#013868" }]}>{count}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const styles=StyleSheet.create({
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
        marginVertical: 5,
        marginHorizontal: 15,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
      },
      iconContainer: {
        marginRight: 10,
      },
      icon: {
        width: 24,
        height: 24,
        fontSize:21,
        color:"#013868"
      },
      detailsContainer: {
        flex: 1,
      },
      countText: {
        fontSize: 14,
        fontWeight: "bold"
      },
      countContainer: {
        backgroundColor: "#f0f0f0",
        borderRadius: 12,
        padding: 5,
        minWidth: 24,
        alignItems: "center"
      },
      itemTitle:{
        color:"#013868"
      }
  })
  export default ReportedProblemGenericComponent;