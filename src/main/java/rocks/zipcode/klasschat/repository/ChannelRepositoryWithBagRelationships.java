package rocks.zipcode.klasschat.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import rocks.zipcode.klasschat.domain.Channel;

public interface ChannelRepositoryWithBagRelationships {
    Optional<Channel> fetchBagRelationships(Optional<Channel> channel);

    List<Channel> fetchBagRelationships(List<Channel> channels);

    Page<Channel> fetchBagRelationships(Page<Channel> channels);
}
