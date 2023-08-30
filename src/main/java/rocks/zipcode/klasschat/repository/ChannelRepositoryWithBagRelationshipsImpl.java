package rocks.zipcode.klasschat.repository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import rocks.zipcode.klasschat.domain.Channel;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class ChannelRepositoryWithBagRelationshipsImpl implements ChannelRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Channel> fetchBagRelationships(Optional<Channel> channel) {
        return channel.map(this::fetchUsers);
    }

    @Override
    public Page<Channel> fetchBagRelationships(Page<Channel> channels) {
        return new PageImpl<>(fetchBagRelationships(channels.getContent()), channels.getPageable(), channels.getTotalElements());
    }

    @Override
    public List<Channel> fetchBagRelationships(List<Channel> channels) {
        return Optional.of(channels).map(this::fetchUsers).orElse(Collections.emptyList());
    }

    Channel fetchUsers(Channel result) {
        return entityManager
            .createQuery("select channel from Channel channel left join fetch channel.users where channel is :channel", Channel.class)
            .setParameter("channel", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Channel> fetchUsers(List<Channel> channels) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, channels.size()).forEach(index -> order.put(channels.get(index).getId(), index));
        List<Channel> result = entityManager
            .createQuery(
                "select distinct channel from Channel channel left join fetch channel.users where channel in :channels",
                Channel.class
            )
            .setParameter("channels", channels)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
